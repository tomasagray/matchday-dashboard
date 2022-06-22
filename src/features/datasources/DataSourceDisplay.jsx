import React, {useState} from "react";
import {CollapsableContainer} from "../../components/CollapsableContainer";
import {PatternKitTypeGroup} from "./PatternKitTypeGroup";
import {dataSourceReset, dataSourceUpdated, selectDataSourceById} from "./dataSourceSlice";
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


export const DataSourceDisplay = (props) => {

    const DEFAULT_FIELD_SIZE = 25
    const [updateDataSource, {isLoading: isUpdating}] = useUpdateDataSourceMutation()
    const [deleteDataSource, {isLoading: isDeleting}] = useDeleteDataSourceMutation()

    let [selectedType, setSelectedType] = useState('')
    // modal controls
    let [showResetModal, setShowResetModal] = useState(false)
    let [showAddPatternKitModal, setShowAddPatternKitModal] = useState(false)
    let [showDeleteDataSourceModal, setShowDeleteDataSourceModal] = useState(false)

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
        setShowResetModal(false)
    }
    const onSaveDataSource = async () => {
        console.log('updating data source', dataSource.dataSourceId)
        await updateDataSource(dataSource)
        console.log('... updated')
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

    const groupPatternKits = (patternKits) => {
        return patternKits.reduce((reducer, patternKit) => {
            let {clazz} = patternKit
            let className = getClassName(clazz)
            reducer[className] = reducer[className] || []
            reducer[className].push(patternKit)
            return reducer
        }, Object.create(null));
    }
    const getTypeGroupHeader = (types) => {
        return types.map(clazz => getClassName(clazz))
            .map(typeName => {
                let selected = typeName === selectedType ? " selected" : ""
                return (
                    <div className={"Type-header" + selected} key={typeName} onClick={(e) => {
                        onSetSelectedPatternKitType(e, typeName)
                    }}>
                        {typeName}
                    </div>
                )
            });
    }
    const getPatternKitDisplays = (groupedPatternKits) => {
        return Object.entries(groupedPatternKits).map((patternKitGroup) => {
            let type = patternKitGroup[0]
            let patternKits = patternKitGroup[1]
            return {
                type: type,
                data: (
                    <PatternKitTypeGroup key={type} type={type}>
                        {
                            patternKits.map(patternKit =>
                                <PatternKitDisplay key={patternKit.id} patternKitId={patternKit.id}/>
                            )
                        }
                    </PatternKitTypeGroup>
                )
            }
        })
    }

    let {dataSourceId} = props
    let dataSource = useSelector(state => {
        if (dataSourceId) {
            return selectDataSourceById(state, dataSourceId)
        }
    })
    let {
        clazz,
        title,
        baseUri,
        patternKits,
    } = dataSource
    let newPatternKit = useSelector(state => selectNewPatternKitForUpload(state))
    let isNewPatternKitValid = useSelector(state => selectIsNewPatternKitValid(state))

    let typeGroupHeader
    let patternKitDisplays
    let patternKitData

    if (patternKits && patternKits.length > 0) {
        let groupedPatternKits = groupPatternKits(patternKits)
        let types = Object.keys(groupedPatternKits)
        typeGroupHeader = getTypeGroupHeader(types)
        patternKitDisplays = getPatternKitDisplays(groupedPatternKits)
    }
    if (selectedType) {
        patternKitData = patternKitDisplays.find(patternKits => patternKits.type === selectedType)?.data
    } else {
        let message
        if (patternKits && patternKits.length > 0) {
            message = <InfoMessage>Please select a <strong>Type</strong> from above.</InfoMessage>
        } else {
            message =
                <InfoMessage>
                    There are currently no Pattern Kits of the selected <strong>Type</strong> for this Data Source. <br/>
                    Click below to add one.
                </InfoMessage>
        }
        patternKitData = <div style={{padding: "2rem 0"}}> {message} </div>
    }

    let type = getClassName(clazz)
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
                        <OKButton clickHandler={onAddPatternKit} disabled={!isNewPatternKitValid}>Add</OKButton>
                    </Footer>
                </Modal>
                <Modal show={showDeleteDataSourceModal}>
                    <Header onHide={onHideDeleteDataSourceModal}>CONFIRM: Delete Data Source?</Header>
                    <Body>
                        <p>
                            Are you sure you want to <strong style={{color: 'red', fontWeight: 'bold'}}>PERMANENTLY DELETE</strong>
                            this Data Source?
                        </p>
                        <table>
                            <tbody>
                            <tr>
                                <td>Title</td>
                                <td>{title}</td>
                                <td>Type</td>
                                <td>{type}</td>
                                <td>Base URI</td>
                                <td>{baseUri}</td>
                            </tr>
                            </tbody>
                        </table>
                    </Body>
                    <Footer>
                        <CancelButton clickHandler={onHideDeleteDataSourceModal} disabled={isDeleting}/>
                        <OKButton clickHandler={onDeleteDataSource} disabled={isDeleting}>DELETE</OKButton>
                    </Footer>
                </Modal>
            </div>

            <form className="Data-source-display">
                <div style={{textAlign: 'right'}}>
                    <button className={"Small-button"} onClick={onShowDeleteDataSourceModal}>
                        <img src={process.env.PUBLIC_URL + '/img/delete/delete_32.png'} alt={'Delete'}/> Delete
                    </button>
                </div>
                <div>
                    <h3>Type: {type}</h3>
                </div>
                <div>
                    <label htmlFor="data-source-base-uri">Base URI:</label>
                    <input type="text" name="data-source-base-uri"
                           value={baseUri} onChange={onBaseUriValChanged}
                           size={baseUri != null ? baseUri.length : DEFAULT_FIELD_SIZE} />
                </div>
                <div>
                    <label>Pattern Kits</label>
                    <div className={"Type-header-container"}>
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
            <div className={"Button-container"} style={{padding: '2rem'}}>
                <CancelButton clickHandler={onShowResetWarning} disabled={isUpdating}>Reset</CancelButton>
                <OKButton clickHandler={onSaveDataSource} disabled={isUpdating}>Save</OKButton>
            </div>
        </CollapsableContainer>
    )
}
