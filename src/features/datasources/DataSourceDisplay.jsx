import React, {useState} from "react";
import {CollapsableContainer} from "../../components/CollapsableContainer";
import {PatternKitTypeGroup} from "./PatternKitTypeGroup";
import {dataSourceReset, dataSourceUpdated, selectCleanDataSourceById, selectDataSourceById,} from "./dataSourceSlice";
import {useDispatch, useSelector} from "react-redux";
import {getClassName} from "../../Utils";
import {InfoMessage} from "../../components/InfoMessage";
import {PatternKitDisplay} from "./PatternKitDisplay";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/CancelButton";
import {OKButton} from "../../components/OKButton";
import {useDeleteDataSourceMutation, useUpdateDataSourceMutation} from "./dataSourceApiSlice";
import {AddPatternKitForm} from "./AddPatternKitForm";
import {clearNewPatternKit, selectIsNewPatternKitValid, selectNewPatternKitForUpload} from "./patternKitSlice";
import {useGetTemplateForTypeQuery} from "./patternKitTemplateApiSlice";
import {FloatingMenu} from "../../components/FloatingMenu";
import {MenuItem} from "../../components/MenuItem";
import {SaveButton} from "../../components/SaveButton";
import {DeleteButton} from "../../components/DeleteButton";


const groupPatternKits = (patternKits) => {
    return patternKits.reduce((reducer, patternKit) => {
        let {clazz} = patternKit
        let className = getClassName(clazz)
        reducer[className] = reducer[className] || []
        reducer[className].push(patternKit)
        return reducer
    }, Object.create(null));
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

// validation patterns
const clazzPattern = /[\w.]+/
const uuidPattern = /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/
const urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z\d.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z\d.-]+)((?:\/[+~%/.\w\-_]*)?\??[-+=&;%@.\w_]*#?[.!/\\\w]*)?)/
const validateDataSource = (dataSource, template) => {

    let templates = template ? [template] : []
    templates.push.apply(templates, template?.relatedTemplates)

    let isTypeValid = clazzPattern.test(dataSource.clazz)
    let isDataSourceIdValid = uuidPattern.test(dataSource.dataSourceId)
    let isPluginIdValid = uuidPattern.test(dataSource.pluginId)
    let isTitleValid = dataSource.title !== ''
    let isBaseUriValid = urlPattern.test(dataSource.baseUri)
    let isPatternKitsValid = dataSource.patternKits.reduce((isValid, patternKit) => {
        let _template = templates.find(template => template.type === patternKit.clazz)
        let isClazzValid = clazzPattern.test(patternKit.clazz)
        let isPatternValid = patternKit.pattern !== ''
        let nonNullFieldCount = Object.values(patternKit.fields)
            .filter(field => field !== null)
            .length
        let isFieldsValid = nonNullFieldCount === _template?.fields.length
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
    }

    const onShowPatternKitTypeMenu = (e) => {
        e.preventDefault()
        setShowTypeMenu(!showTypeMenu)
    }
    const onClearPatternKitTypeSelection = (e) => {
        e.preventDefault()
        setSelectedType('')
    }

    const onShowAddPatternKitModal = () => {
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

    let {dataSourceId} = props
    let dataSource = useSelector(state => selectDataSourceById(state, dataSourceId))
    let {
        clazz,
        title,
        baseUri,
        patternKits,
    } = dataSource
    let type = getClassName(clazz)
    let {data: template} = useGetTemplateForTypeQuery(type)
    let isDataSourceValid = validateDataSource(dataSource, template)
    let newPatternKit = useSelector(state => selectNewPatternKitForUpload(state))
    let isNewPatternKitValid = useSelector(state => selectIsNewPatternKitValid(state))
    let cleanDataSource = useSelector(state => selectCleanDataSourceById(state, dataSourceId))
    let isModified = cleanDataSource !== dataSource
    const [updateDataSource, {isLoading: isUpdating}] = useUpdateDataSourceMutation()
    const [deleteDataSource, {isLoading: isDeleting}] = useDeleteDataSourceMutation()

    let [showTypeMenu, setShowTypeMenu] = useState(false)
    let [selectedType, setSelectedType] = useState('')
    let [editMenuHidden, setEditMenuHidden] = useState(true)
    let [isEditable, setIsEditable] = useState(false)
    // modal controls
    let [showResetModal, setShowResetModal] = useState(false)
    let [showAddPatternKitModal, setShowAddPatternKitModal] = useState(false)
    let [showDeleteDataSourceModal, setShowDeleteDataSourceModal] = useState(false)


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

    let fieldStyle = {display: 'flex', alignItems: 'center'}
    let hoverColor = isEditable ? 'light-green' : 'green'
    let editImg = !isEditable ? '/edit-pencil/edit-pencil_16.png' : '/cancel/cancel_16.png'
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
                        <CancelButton clickHandler={onCloseResetWarning}/>
                        <OKButton clickHandler={onResetDataSource}>RESET</OKButton>
                    </Footer>
                </Modal>
                <Modal show={showAddPatternKitModal}>
                    <Header onHide={onHideAddPatternKitModal}>Add new Pattern Kit</Header>
                    <Body>
                        <AddPatternKitForm dataSourceType={type} dataSourceId={dataSourceId}/>
                    </Body>
                    <Footer>
                        <CancelButton clickHandler={onHideAddPatternKitModal}>Discard</CancelButton>
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
                        <CancelButton clickHandler={onHideDeleteDataSourceModal} disabled={isDeleting}/>
                        <DeleteButton onClick={onDeleteDataSource} disabled={isDeleting}/>
                    </Footer>
                </Modal>
            </div>

            <form className="Data-source-display">
                <div id={"data-source-edit-menu"} style={{float: 'right'}}>
                    <button onClick={onMenuButtonClick} className="Edit-menu-button">&#8942;</button>
                    <FloatingMenu hidden={editMenuHidden} onClickOutside={setEditMenuHidden}>
                        {editButton}
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
                <div style={fieldStyle}>
                    <h3 style={{marginRight: '1rem'}}>Type<span style={{color: '#aaa'}}> : </span></h3>
                    <p style={{fontSize: 'large'}}>{type}</p>
                </div>
                <div style={fieldStyle}>
                    <h3 style={{marginRight: '1rem'}}>Base URI<span style={{color: '#aaa'}}> :</span></h3>
                    <input type="text" name="data-source-base-uri" disabled={!isEditable}
                           value={baseUri} onChange={onBaseUriValChanged}
                           size={baseUri != null ? baseUri.length : DEFAULT_FIELD_SIZE} />
                </div>
                <div>
                    <div className={"Pattern-kit-type-header"}>
                        <h3 style={{marginRight: '2rem'}}>
                            Pattern Kits <span style={{color: '#aaa'}}> :</span>
                        </h3>
                        <button className={"Filter-by-type-button"} onClick={onShowPatternKitTypeMenu}>
                            Filter by type
                            <img src={process.env.PUBLIC_URL+'/img/icon/link-arrow/link-arrow_64.png'} alt={"Filter by type"}
                                    className={showTypeMenu ? 'flipped' : ''}/>
                        </button>
                        <button className={"Clear-filter-button"} style={{display: selectedType ? '' : 'none'}}
                                onClick={onClearPatternKitTypeSelection}>
                            <img src={process.env.PUBLIC_URL + '/img/icon/clear/clear_16.png'} alt={"Clear selected type"}/>
                        </button>
                    </div>
                    <div className={"Type-header-container"} style={{display: showTypeMenu ? '' : 'none'}}>
                        {typeGroupHeader}
                    </div>
                    <div>
                        {patternKitData}
                    </div>
                </div>
            </form>
            <div style={{textAlign: 'right', padding: '2rem'}}>
                <button className="Small-button" onClick={onShowAddPatternKitModal} disabled={isUpdating}>Add Pattern Kit...</button>
            </div>
            <div className={"Button-container"} style={{padding: '2rem', display: isModified ? '' : 'none'}}>
                <CancelButton clickHandler={onShowResetWarning} disabled={isUpdating}>Reset</CancelButton>
                <SaveButton onClick={onSaveDataSource} disabled={isUpdating || !isDataSourceValid} />
            </div>
        </CollapsableContainer>
    )
}
