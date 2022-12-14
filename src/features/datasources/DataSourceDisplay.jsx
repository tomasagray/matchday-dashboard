import React, {useEffect, useState} from "react";
import {CollapsableContainer} from "../../components/CollapsableContainer";
import {PatternKitTypeGroup} from "./PatternKitTypeGroup";
import {
  dataSourceReset,
  dataSourceUpdated,
  selectCleanDataSourceById,
  selectDataSourceById,
} from "../../slices/dataSourceSlice";
import {useDispatch, useSelector} from "react-redux";
import {
  getClassName,
  getDownloadableJson,
  getToastMessage,
  isValidUrl,
  isValidUuid
} from "../../app/utils";
import {InfoMessage} from "../../components/InfoMessage";
import {PatternKitDisplay} from "./PatternKitDisplay";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/controls/CancelButton";
import {OKButton} from "../../components/controls/OKButton";
import {
  useDeleteDataSourceMutation,
  useUpdateDataSourceMutation
} from "../../slices/api/dataSourceApiSlice";
import {AddPatternKitForm} from "./AddPatternKitForm";
import {
  clearNewPatternKit,
  selectIsNewPatternKitValid,
  selectNewPatternKitForUpload
} from "../../slices/patternKitSlice";
import {
  useGetTemplateForTypeQuery
} from "../../slices/api/patternKitTemplateApiSlice";
import {FloatingMenu} from "../../components/FloatingMenu";
import {MenuItem} from "../../components/MenuItem";
import {SaveButton} from "../../components/controls/SaveButton";
import {DeleteButton} from "../../components/controls/DeleteButton";
import {ClearButton} from "../../components/controls/ClearButton";
import {validateFields} from "./PatternKitFieldEditor";
import {toast} from "react-toastify";

const groupPatternKits = (patternKits) => {
    return patternKits.reduce((reducer, patternKit) => {
        let {clazz} = patternKit
        let className = getClassName(clazz)
        reducer[className] = reducer[className] || []
        reducer[className].push(patternKit)
        return reducer
    }, Object.create(null))
}
const getTypeGroupHeader = (types, selectedType, setTypeHandler) => {
    return types.map(clazz => getClassName(clazz))
        .map(typeName => {
            let selected = typeName === selectedType ? " selected" : ""
            return (
                <div className={"Type-header" + selected} key={typeName} onClick={(e) => {
                    setTypeHandler(e, typeName)
                }}>
                    {typeName}
                </div>
            )
        });
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
                            <PatternKitDisplay key={patternKit.id} patternKitId={patternKit.id} disabled={!isEditable}/>
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

export const DataSourceDisplay = (props) => {

    const DEFAULT_FIELD_SIZE = 25
    const dispatch = useDispatch()

    // save/reset data source modal
    const onBaseUriValChanged = (e) => {
        let baseUriVal = e.target.value
        let updatedDataSource = {
            ...dataSource,
            baseUri: baseUriVal
        }
        dispatch(dataSourceUpdated({id: dataSourceId, changes: updatedDataSource}))
    }
    const onSetSelectedPatternKitType = (e, type) => {
        setSelectedType(type)
    }
    const onShowResetWarning = () => {
        setShowResetModal(true)
    }
    const onCloseResetWarning = () => {
        setShowResetModal(false)
    }
    const onResetDataSource = () => {
        dispatch( dataSourceReset({dataSourceId: dataSourceId}) )
        setIsEditable(false)
        setShowResetModal(false)
    }
    const onSaveDataSource = async () => {
        console.log('updating data source', dataSource.dataSourceId)
        await updateDataSource(dataSource)
        console.log('... updated')
        setIsEditable(false)
    }

    // type submenu
    const onShowPatternKitTypeMenu = (e) => {
        e.preventDefault()
        setShowTypeMenu(!showTypeMenu)
    }
    const onClearPatternKitTypeSelection = (e) => {
        e.preventDefault()
        setSelectedType('')
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
    const onClickEditButton = () => {
        if (!isEditable) {
            setIsEditable(true)
        }
        if (isEditable && !isModified) {
            setIsEditable(false)
        }
        setEditMenuHidden(true)
    }
    const onExportDataSource = () => {
        const a = document.createElement('a')
        a.href = getDownloadableJson(dataSource)
        const filename = `data-source_${dataSourceId}.json`
        a.setAttribute('download', filename)
        a.click()
        setEditMenuHidden(true)
        toast('Downloaded Data Source to: ' + filename)
    }
    const onShowDeleteDataSourceModal = (e) => {
        e.preventDefault()
        setShowDeleteDataSourceModal(true)
        setEditMenuHidden(true)
    }
    const onHideDeleteDataSourceModal = () => {
        setShowDeleteDataSourceModal(false)
    }
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
    }, [
        deleteError,
        isDeleteError,
        isDeleteSuccess,
        isTemplateError,
        isUpdateError,
        isUpdateSuccess,
        templateError,
        updateError
    ])

    // state
    let [showTypeMenu, setShowTypeMenu] = useState(false)
    let [selectedType, setSelectedType] = useState('')
    let [editMenuHidden, setEditMenuHidden] = useState(true)
    let [isEditable, setIsEditable] = useState(false)
    // modal controls
    let [showResetModal, setShowResetModal] = useState(false)
    let [showAddPatternKitModal, setShowAddPatternKitModal] = useState(false)
    let [showDeleteDataSourceModal, setShowDeleteDataSourceModal] = useState(false)

    // components
    let typeGroupHeader
    let patternKitDisplays
    let patternKitData

    if (patternKits && patternKits.length > 0) {
        let groupedPatternKits = groupPatternKits(patternKits)
        let types = Object.keys(groupedPatternKits)
        typeGroupHeader = getTypeGroupHeader(types, selectedType, onSetSelectedPatternKitType)
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
                        There are currently no Pattern Kits of the selected <strong>Type</strong> for this Data Source. <br/>
                        Click below to add one.
                    </InfoMessage>
                </div>
        }
    }

    const hoverColor = isEditable ? 'light-green' : 'green'
    const editImg = !isEditable ? '/edit/edit_16.png' : '/cancel/cancel_16.png'
    const editButton = isModified ? null :
        <MenuItem onClick={onClickEditButton} backgroundColor={hoverColor}>
            <p>{isEditable ? 'Cancel' : ''} Edit</p>
            <img src={process.env.PUBLIC_URL + '/img/icon/' + editImg} alt="Edit"/>
        </MenuItem>

    return (
        <CollapsableContainer _key={dataSourceId} title={title}>
            <div id="modal-container">
                <Modal show={showResetModal}>
                    <Header onHide={onCloseResetWarning}>Reset changes to Data Source?</Header>
                    <Body>
                        <p>Are you sure you want to reset all changes to this Data Source?</p>
                        <strong>This cannot be undone.</strong>
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
                        <p>
                            Are you sure you want to <strong style={{color: 'red', fontWeight: 'bold'}}>PERMANENTLY DELETE</strong>&nbsp;
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
                    </Body>
                    <Footer>
                        <CancelButton onClick={onHideDeleteDataSourceModal} disabled={isDeleting}/>
                        <DeleteButton onClick={onDeleteDataSource} isLoading={isDeleting}/>
                    </Footer>
                </Modal>
            </div>

            <form className="Data-source-display">
                <div id={"data-source-edit-menu"} style={{float: 'right'}}>
                    <button onClick={onMenuButtonClick} className="Edit-menu-button">&#8942;</button>
                    <FloatingMenu hidden={editMenuHidden} onClickOutside={setEditMenuHidden}>
                        {editButton}
                        <MenuItem onClick={onExportDataSource} backgroundColor="cornflowerblue">
                            <p>Export</p>
                            <img src={process.env.PUBLIC_URL + '/img/icon/download/download_16.png'} alt="Export" />
                        </MenuItem>
                        <MenuItem onClick={onShowDeleteDataSourceModal} backgroundColor="darkred">
                            <p>Delete</p>
                            <img src={process.env.PUBLIC_URL + '/img/icon/delete/delete_16.png'} alt="Delete"/>
                        </MenuItem>
                    </FloatingMenu>
                </div>

                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 0}}>
                    <div>
                        <p style={{fontSize: 'small'}}>
                            <strong>ID</strong>: <span style={{color: '#aaa'}}>{dataSourceId}</span>
                        </p>
                    </div>
                </div>
                <div className="Data-source-field">
                    <h3 style={{marginRight: '1rem'}}>Type<span style={{color: '#aaa'}}> : </span></h3>
                    <p style={{fontSize: 'large'}}>{type}</p>
                </div>
                <div className="Data-source-field">
                    <h3 style={{marginRight: '1rem', whiteSpace: 'nowrap'}}>
                        Base URI<span style={{color: '#aaa'}}> :</span>
                    </h3>
                    <input type="text" name="data-source-base-uri" disabled={!isEditable}
                           value={baseUri} onChange={onBaseUriValChanged}
                           size={baseUri != null ? baseUri.length + 5 : DEFAULT_FIELD_SIZE} />
                    <div style={{display: 'flex', justifyContent: 'flex-end', width: '-webkit-fill-available'}}>
                        <button className="Small-button" onClick={onShowAddPatternKitModal} disabled={isUpdating}>Add Pattern Kit...</button>
                    </div>
                </div>

                <div>
                    <div className={"Pattern-kit-type-header"}>
                        <h3 style={{marginRight: '2rem'}}>
                            Pattern Kits <span style={{color: '#aaa'}}> :</span>
                        </h3>
                        <button className={"Filter-by-type-button"} onClick={onShowPatternKitTypeMenu}>
                            Filter by type
                            <img src={process.env.PUBLIC_URL+'/img/icon/link-arrow/link-arrow_64.png'}
                                 alt={"Filter by type"} className={showTypeMenu ? 'flipped' : ''}/>
                        </button>
                        <ClearButton onClick={onClearPatternKitTypeSelection} style={{display: selectedType ? '' : 'none'}} />
                    </div>
                    <div className={"Type-header-container"} style={{display: showTypeMenu ? '' : 'none'}}>
                        {typeGroupHeader}
                    </div>
                    <div>
                        {patternKitData}
                    </div>
                </div>
            </form>
            <div className={"Button-container"} style={{padding: '2rem', display: isModified ? '' : 'none'}}>
                <CancelButton onClick={onShowResetWarning} disabled={isUpdating}>Reset</CancelButton>
                <SaveButton onClick={onSaveDataSource} disabled={!isDataSourceValid || isUpdating} isLoading={isUpdating}/>
            </div>
        </CollapsableContainer>
    )
}
