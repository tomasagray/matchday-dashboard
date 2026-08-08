import React, {useEffect, useState} from "react";
import {PatternKitTypeGroup} from "./PatternKitTypeGroup";
import {
    dataSourceReset,
    dataSourceUpdated,
    selectCleanDataSourceById,
    selectDataSourceById,
} from "../../slices/dataSourceSlice";
import {useDispatch, useSelector} from "react-redux";
import {downloadData, getClassName, getDownloadableJson, getToastMessage, isValidUrl, isValidUuid} from "../../utils";
import {InfoMessage} from "../../components/InfoMessage";
import {PatternKitDisplay} from "./PatternKitDisplay";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/controls/CancelButton";
import {OKButton} from "../../components/controls/OKButton";
import {
    useDeleteDataSourceMutation,
    useToggleDataSourceMutation,
    useToggleFlaredMutation,
    useUpdateDataSourceMutation
} from "../../slices/api/dataSourceApiSlice";
import {AddPatternKitForm} from "./AddPatternKitForm";
import {
    clearNewPatternKit,
    selectIsNewPatternKitValid,
    selectNewPatternKitForUpload
} from "../../slices/patternKitSlice";
import {useGetTemplateForTypeQuery} from "../../slices/api/patternKitTemplateApiSlice";
import {FloatingMenu} from "../../components/FloatingMenu";
import {MenuItem} from "../../components/MenuItem";
import {SaveButton} from "../../components/controls/SaveButton";
import {DeleteButton} from "../../components/controls/DeleteButton";
import {validateFields} from "./PatternKitFieldEditor";
import {toast} from "react-toastify";
import {AccordionDisplay} from "../../components/AccordionDisplay";
import {AccordionHeader} from "../../components/AccordionHeader";
import {Status, ToggleSwitch} from "../../components/controls/ToggleSwitch";
import {WarningMessage} from "../../components/WarningMessage";


const SORT_PKID = 'pkid'
const SORT_TYPE = 'type'

export const DataSourceDisplay = (props) => {

    const dispatch = useDispatch()

    const comparePatternKits = (a, b) => sortMode === SORT_PKID ? a.id - b.id
        : getClassName(a.clazz).localeCompare(getClassName(b.clazz))
    const groupPatternKits = (patternKits) => {
        // make a mutable copy
        let _patternKits = [...patternKits]
        return _patternKits
            .sort(comparePatternKits)
            .reduce((reducer, patternKit) => {
                let {clazz} = patternKit
                let className = getClassName(clazz)

                reducer[className] = reducer[className] || []
                reducer[className].push(patternKit)

                return reducer
            }, Object.create(null))
    }
    const getTypeMenuItem = (types, selectedType, setTypeHandler) => {
        return types.map(clazz => getClassName(clazz))
            .map(typeName => {
                let selected = typeName === selectedType ? " selected" : ""
                return (
                    <MenuItem className={"Type-header" + selected} key={typeName} onClick={(e) => {
                        setTypeHandler(e, typeName)
                    }}>
                        {typeName}
                    </MenuItem>
                )
            })
    }
    const getPatternKitDisplays = (patternKits, isEditable) => {
        return Object.entries(patternKits).map((patternKitGroup) => {
            let type = patternKitGroup[0]
            let patternKits = patternKitGroup[1]
            return {
                type: type,
                data: (
                    <PatternKitTypeGroup key={type} type={type}>
                        {
                            patternKits.map(patternKit =>
                                <PatternKitDisplay key={patternKit.id} patternKitId={patternKit.id}
                                                   disabled={!isEditable}/>
                            )
                        }
                    </PatternKitTypeGroup>
                )
            }
        })
    }

    const clazzPattern = /[\w.]+/
    const validateDataSource = (dataSource, template) => {

        let templates = template ? [template] : []
        templates.push.apply(templates, template ? template['relatedTemplates'] : null)

        let isTypeValid = clazzPattern.test(dataSource.clazz)
        let isDataSourceIdValid = isValidUuid(dataSource.dataSourceId)
        let isPluginIdValid = isValidUuid(dataSource.pluginId)
        let isTitleValid = dataSource.title !== ''
        let isBaseUriValid = isValidUrl(dataSource.baseUri)
        let isPatternKitsValid = dataSource.patternKits.reduce((isValid, patternKit) => {
            let _template = templates.find(template => template.type === patternKit.clazz)
            let isClazzValid = clazzPattern.test(patternKit.clazz)
            let isPatternValid = patternKit.pattern !== ''
            let isFieldsValid = validateFields(patternKit.fields, _template)
            return isValid && isClazzValid && isPatternValid && isFieldsValid
        }, true)
        return isTypeValid &&
            isDataSourceIdValid &&
            isPluginIdValid &&
            isTitleValid &&
            isBaseUriValid &&
            isPatternKitsValid
    }
    const getTypeIcon = (type) => {
        let icon = ''
        switch (type) {
            case 'Match':
            case 'Event':
                icon = 'events'
                break
            case 'Competition':
                icon = 'competitions'
                break
            case 'VideoFileSource':
                icon = 'videoFileSource'
                break
        }

        return <img alt="Datasource type"
                    src={`/img/icon/${icon}/${icon}_64.png`}
                    style={{margin: '0 .5rem'}}
                    width={24}
        />
    }
    const toggleIsShown = () => {
        setIsShown(!isShown)
        setIsClosing(isShown)
    }
    const handleClosingFinished = () => setIsClosing(false)
    const onSortPatternKits = (e, mode) => {
        e.preventDefault()
        setSortMode(mode)
    }

    const onEnabledChange = async () => {
        console.log(`Setting Datasource [${dataSourceId}] to`, isDataSourceEnabled ? 'disabled' : 'enabled')
        await toggleDataSource({id: dataSourceId, enabled: !isDataSourceEnabled})
        console.log('Datasource [', dataSourceId, '] set to', isDataSourceEnabled ? 'enabled' : 'disabled')
    }
    const onToggleFlaresolverr = async () => {
        console.log(`Setting Flaresolverr protection for Datasource [${dataSourceId}] to`, isFlared ? 'disabled' : 'enabled')
        await toggleFlared({id: dataSourceId, flared: !isFlared})
        console.log('Datasource [', dataSourceId, '] Flaresolverr protection set to', isFlared ? 'enabled' : 'disabled')
    }
    const onBaseUriValChanged = (e) => {
        let baseUriVal = e.target.value
        let updatedDataSource = {
            ...dataSource,
            baseUri: baseUriVal
        }
        dispatch(dataSourceUpdated({id: dataSourceId, changes: updatedDataSource}))
    }
    const onLinkSelectorValChanged = (e) => {
        let linkSelectorVal = e.target.value
        let updatedDataSource = {
            ...dataSource,
            linkSelector: linkSelectorVal
        }
        dispatch(dataSourceUpdated({id: dataSourceId, changes: updatedDataSource}))
    }
    const onSetSelectedPatternKitType = (e, type) => {
        setSelectedType(type)
        setShowTypeMenu(false)
    }
    const onResetDataSource = () => {
        dispatch(dataSourceReset({dataSourceId: dataSourceId}))
        setIsEditable(false)
        setShowResetModal(false)
    }
    const onSaveDataSource = async () => {
        console.log('updating data source', dataSource.dataSourceId)
        await updateDataSource(dataSource)
        console.log('... data source updated')
        setIsEditable(false)
    }
    const onShowResetWarning = () => setShowResetModal(true)
    const onCloseResetWarning = () => setShowResetModal(false)

    // type submenu
    const onShowPatternKitTypeMenu = (e) => {
        e.preventDefault()
        setShowTypeMenu(!showTypeMenu)
    }
    const onClearPatternKitTypeSelection = (e) => {
        e.preventDefault()
        setSelectedType('')
        setShowTypeMenu(false)
    }

    // add pattern kit modal
    const onShowAddPatternKitModal = (e) => {
        e.preventDefault()
        setShowAddPatternKitModal(true)
    }
    const onHideAddPatternKitModal = () => {
        dispatch(clearNewPatternKit({}))
        setShowAddPatternKitModal(false)
    }
    const onAddPatternKit = () => {
        let updatedDataSource = {
            ...dataSource,
            patternKits: [
                ...dataSource.patternKits,
                newPatternKit,
            ]
        }
        dispatch(dataSourceUpdated({id: dataSourceId, changes: updatedDataSource}))
        onHideAddPatternKitModal()
    }

    // floating menu
    const onMenuButtonClick = (e) => {
        e.preventDefault()
        setEditMenuHidden(false)
    }
    const onClickEditButton = (e) => {
        e.preventDefault()
        if (!isEditable) setIsEditable(true)
        if (isEditable && !isModified) setIsEditable(false)
        if (isEditable && isModified) onShowResetWarning()

        setEditMenuHidden(true)
    }
    const onExportDataSource = () => {
        setEditMenuHidden(true)
        let filename = `data-source_${dataSourceId}.json`
        let data = getDownloadableJson(dataSource)
        downloadData(data, filename)
        toast('Downloaded Data Source to: ' + filename)
    }
    const onShowDeleteDataSourceModal = (e) => {
        e.preventDefault()
        setShowDeleteDataSourceModal(true)
        setEditMenuHidden(true)
    }
    const onHideDeleteDataSourceModal = () => setShowDeleteDataSourceModal(false)
    const onDeleteDataSource = async () => {
        console.log('deleting data source with ID:', dataSourceId)
        await deleteDataSource(dataSourceId)
        onHideDeleteDataSourceModal()
        console.log(`data source: ${dataSourceId} deleted`)
    }

    let {dataSourceId} = props
    let cleanDataSource = useSelector(state => selectCleanDataSourceById(state, dataSourceId))
    let newPatternKit = useSelector(state => selectNewPatternKitForUpload(state))
    let isNewPatternKitValid = useSelector(state => selectIsNewPatternKitValid(state))
    let dataSource = useSelector(state => selectDataSourceById(state, dataSourceId))
    let {
        clazz,
        title,
        baseUri,
        patternKits,
        linkSelector,
        enabled: isDataSourceEnabled,
        flared: isFlared,
    } = dataSource
    let isModified = cleanDataSource !== dataSource
    let type = getClassName(clazz)

    // hooks
    let {
        data: template,
        isSuccess: isTemplateSuccess,
        isError: isTemplateError,
        error: templateError
    } = useGetTemplateForTypeQuery(type)
    let isDataSourceValid = isTemplateSuccess && validateDataSource(dataSource, template)
    const [updateDataSource, {
        isLoading: isUpdating,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateDataSourceMutation()
    const [deleteDataSource, {
        isLoading: isDeleting,
        isSuccess: isDeleteSuccess,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteDataSourceMutation()
    const [toggleDataSource, {
        isLoading: isToggling,
        isError: isToggleError,
        error: toggleError
    }] = useToggleDataSourceMutation()
    const [toggleFlared, {
        isLoading: isFlaring,
        isError: isFlaredError,
        error: flaredError
    }] = useToggleFlaredMutation()

    // toast messages
    useEffect(() => {
        if (isUpdateSuccess) {
            toast('Data source updated successfully')
        }
        if (isDeleteSuccess) {
            toast('Data source successfully deleted')
        }
        if (isTemplateError) {
            let msg = 'Could not get required pattern kit template: ' + getToastMessage(templateError)
            toast.error(msg)
        }
        if (isUpdateError) {
            let msg = 'Could not update date source: ' + getToastMessage(updateError)
            toast.error(msg)
        }
        if (isDeleteError) {
            let msg = 'Could not delete data source: ' + getToastMessage(deleteError)
            toast.error(msg)
        }
        if (isToggleError) {
            let msg = 'Could not enable/disable data source: ' + getToastMessage(toggleError)
            toast.error(msg)
        }
        if (isFlaredError) {
            let msg = 'Could not enable/disable Flaresolverr for data source: ' + getToastMessage(flaredError)
            toast.error(msg)
        }
    }, [
        isDeleteSuccess,
        isUpdateSuccess,
        isDeleteError,
        isTemplateError,
        isUpdateError,
        isToggleError,
        isFlaredError,
        deleteError,
        templateError,
        updateError,
        toggleError,
        flaredError,
    ])

    // state
    let [isShown, setIsShown] = useState(false)
    let [isClosing, setIsClosing] = useState(false)
    let [showTypeMenu, setShowTypeMenu] = useState(false)
    let [selectedType, setSelectedType] = useState('')
    let [editMenuHidden, setEditMenuHidden] = useState(true)
    let [isEditable, setIsEditable] = useState(false)

    // modal controls
    let [showResetModal, setShowResetModal] = useState(false)
    let [showAddPatternKitModal, setShowAddPatternKitModal] = useState(false)
    let [showDeleteDataSourceModal, setShowDeleteDataSourceModal] = useState(false)
    let [sortMode, setSortMode] = useState(SORT_TYPE)

    // components
    let typeMenu = [
        <MenuItem onClick={onClearPatternKitTypeSelection} key={dataSourceId + '-show-all-pks'}>All</MenuItem>
    ]
    let patternKitDisplays
    let patternKitData

    if (patternKits && patternKits.length > 0) {
        let groupedPatternKits = groupPatternKits(patternKits)
        let types = Object.keys(groupedPatternKits)
        let items = getTypeMenuItem(types, selectedType, onSetSelectedPatternKitType)
        typeMenu.push(...items)
        patternKitDisplays = getPatternKitDisplays(groupedPatternKits, isEditable)
    }
    if (selectedType) {
        patternKitData = patternKitDisplays.find(patternKits => patternKits.type === selectedType)?.data
    } else {
        if (patternKits && patternKits.length > 0) {
            patternKitData = patternKitDisplays.flatMap(display => display?.data)
        } else {
            patternKitData =
                <div style={{padding: "2rem 0"}}>
                    <InfoMessage>
                        There are currently no Pattern Kits of the selected <strong>Type</strong> for this Data
                        Source. <br/>
                        Click below to add one.
                    </InfoMessage>
                </div>
        }
    }

    const typeIcon = getTypeIcon(type)
    const editSection = isEditable ?
        // editing...
        <>
            <span>&nbsp;</span>
            <div className={"Button-container"}>
                <CancelButton onClick={e => onClickEditButton(e)}>
                    Cancel Edit &nbsp;
                    <img src={'/img/icon/cancel/cancel_16.png'} alt="Cancel"/>
                </CancelButton>
                <SaveButton onClick={onSaveDataSource}
                            disabled={!isDataSourceValid || isUpdating}
                            isLoading={isUpdating}/>
            </div>
        </> :
        // not editing.
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: 300,
                minWidth: '50%'
            }}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '1rem'}}>Enabled</span>
                    <ToggleSwitch
                        status={
                            isToggling ? Status().Loading :
                                isDataSourceEnabled ? Status().Checked : Status().Unchecked
                        }
                        onclick={onEnabledChange}
                    />
                </div>
                <div style={{display: 'flex', alignItems: 'center', marginRight: '1rem'}}>
                    <span style={{marginRight: '1rem'}}>Use Flaresolverr</span>
                    <ToggleSwitch
                        status={
                            isFlaring ? Status().Loading :
                                isFlared ? Status().Checked : Status().Unchecked
                        }
                        onclick={onToggleFlaresolverr}
                    />
                </div>

            </div>
            <div id={"data-source-edit-menu"} style={{float: 'right'}}>
                <button onClick={onMenuButtonClick} className="Edit-menu-button">&#8942;</button>
                <FloatingMenu style={{right: '0px'}} hidden={editMenuHidden}
                              onClickOutside={setEditMenuHidden}>
                    <MenuItem onClick={onClickEditButton} backgroundColor="green">
                        <p>Edit</p>
                        <img src="/img/icon/edit/edit_16.png" alt="Edit"/>
                    </MenuItem>
                    <MenuItem onClick={onExportDataSource} backgroundColor="cornflowerblue">
                        <p>Export</p>
                        <img src={'/img/icon/download/download_16.png'} alt="Export"/>
                    </MenuItem>
                    <MenuItem onClick={onShowDeleteDataSourceModal} backgroundColor="darkred">
                        <p>Delete</p>
                        <img src={'/img/icon/delete/delete_16.png'} alt="Delete"/>
                    </MenuItem>
                </FloatingMenu>
            </div>
        </>

    return (
        <div style={{marginTop: '1rem'}}>
            <AccordionHeader isExpanded={isShown} onClick={toggleIsShown}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <img alt="Data source" className="Datasource-icon"
                         src="/img/icon/datasource/datasource_64.png" width={24}/>
                    <div>
                        <h2>{title}</h2>
                        <p className="Datasource-id">{dataSourceId}</p>
                    </div>
                </div>
            </AccordionHeader>
            <AccordionDisplay isShown={isShown} isClosing={isClosing} onFinished={handleClosingFinished}>
                <div id="modal-container">
                    <Modal show={showResetModal}>
                        <Header onHide={onCloseResetWarning}>Reset changes to Data Source?</Header>
                        <Body>
                            <WarningMessage>
                                <span>
                                    Are you sure you want to reset all changes to this Data Source? <br/>
                                    You will lose all changes.
                                </span>
                                <strong>This cannot be undone.</strong>
                            </WarningMessage>
                        </Body>
                        <Footer>
                            <CancelButton onClick={onCloseResetWarning}/>
                            <OKButton onClick={onResetDataSource}>RESET</OKButton>
                        </Footer>
                    </Modal>
                    <Modal show={showAddPatternKitModal}>
                        <Header onHide={onHideAddPatternKitModal}>Add new Pattern Kit</Header>
                        <Body>
                            <AddPatternKitForm dataSourceType={type} dataSourceId={dataSourceId}/>
                        </Body>
                        <Footer>
                            <CancelButton onClick={onHideAddPatternKitModal}>Discard</CancelButton>
                            <SaveButton onClick={onAddPatternKit} disabled={!isNewPatternKitValid}>Add</SaveButton>
                        </Footer>
                    </Modal>
                    <Modal show={showDeleteDataSourceModal}>
                        <Header onHide={onHideDeleteDataSourceModal}>
                            CONFIRM: <span style={{color: '#aaa'}}>Delete Data Source?</span>
                        </Header>
                        <Body>
                            <WarningMessage style={{width: '100%'}}>
                                <div>
                                    <p>
                                        Are you sure you want to <strong style={{color: 'red', fontWeight: 'bold'}}>PERMANENTLY
                                        DELETE</strong>&nbsp;
                                        this Data Source?
                                    </p>
                                    <table className={"Data-source-table"}>
                                        <tbody>
                                        <tr>
                                            <td><h3>ID</h3></td>
                                            <td>{dataSourceId}</td>
                                        </tr>
                                        <tr>
                                            <td><h3>Title</h3></td>
                                            <td>{title}</td>
                                        </tr>
                                        <tr>
                                            <td><h3>Type</h3></td>
                                            <td>{type}</td>
                                        </tr>
                                        <tr>
                                            <td><h3>Base URI</h3></td>
                                            <td>{baseUri}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </WarningMessage>
                        </Body>
                        <Footer>
                            <CancelButton onClick={onHideDeleteDataSourceModal} disabled={isDeleting}/>
                            <DeleteButton onClick={onDeleteDataSource} isLoading={isDeleting}/>
                        </Footer>
                    </Modal>
                </div>
                <form className="Data-source-display">
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 75}}>
                        {editSection}
                    </div>
                    <table className="Data-source-table">
                        <tbody>
                        <tr>
                            <td>Type</td>
                            <td>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    {typeIcon}
                                    {type}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Base URI</td>
                            <td>
                                <input type="text"
                                       name={dataSourceId + "-baseUri"}
                                       value={baseUri ?? ''}
                                       style={{width: '100%'}}
                                       disabled={!isEditable}
                                       onChange={onBaseUriValChanged}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Link Selector</td>
                            <td>
                                <input type="text"
                                       name={dataSourceId + "-linkSelector"}
                                       value={linkSelector ?? ''}
                                       style={{width: 'fit-content', maxWidth: '80%'}}
                                       disabled={!isEditable}
                                       onChange={onLinkSelectorValChanged}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <img alt="Pattern Kits"
                                 style={{marginRight: '.5rem'}}
                                 src="/img/icon/pattern-kit/pattern-kit_64.png"
                                 width={24} height={24}
                            />
                            <h3 style={{marginRight: '2rem'}}>Pattern Kits</h3>
                        </div>
                        <button className="Small-button"
                                style={{margin: 0}}
                                onClick={onShowAddPatternKitModal}
                                disabled={isUpdating}>
                            Add Pattern Kit...
                        </button>
                    </div>
                    <div className={"Pattern-kit-type-header"}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                            <div>
                                <button className={"Filter-by-type-button"} onClick={onShowPatternKitTypeMenu}>
                                    Show: {selectedType === '' ? 'All' : selectedType}
                                </button>
                                <FloatingMenu
                                    className={"Type-header-container"}
                                    hidden={!showTypeMenu}
                                    onClickOutside={() => setShowTypeMenu(false)}>
                                    {typeMenu}
                                </FloatingMenu>
                            </div>
                            <div>
                                <span style={{marginRight: '1rem'}}>Sort by:</span>
                                <button style={{textDecoration: sortMode === SORT_PKID ? 'underline' : 'none'}}
                                        onClick={(e) => onSortPatternKits(e, SORT_PKID)}>
                                    ID
                                </button>
                                |
                                <button style={{textDecoration: sortMode === SORT_TYPE ? 'underline' : 'none'}}
                                        onClick={(e) => onSortPatternKits(e, SORT_TYPE)}>
                                    Type
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        {patternKitData}
                    </div>
                </form>
            </AccordionDisplay>
        </div>
    )
}
