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
import {useUpdateDataSourceMutation} from "./dataSourceApiSlice";


export const DataSourceDisplay = (props) => {

    const DEFAULT_FIELD_SIZE = 25
    let [showResetModal, setShowResetModal] = useState(false)
    const [updateDataSource, {isLoading: isUpdating}] = useUpdateDataSourceMutation()
    if (isUpdating) {
        console.log('updating...')
    }

    const dispatch = useDispatch();
    const onBaseUriValChanged = (e) => {
        let baseUriVal = e.target.value
        let updatedDataSource = {
            ...dataSource,
            baseUri: baseUriVal
        }
        dispatch(dataSourceUpdated({id: dataSourceId, changes: updatedDataSource}))
    }
    const onAddNewPatternKit = () => {
        console.log('add new pattern kit button clicked')
    }
    const onSaveDataSource = async () => {
        console.log('saving data source', dataSource)
        await updateDataSource(dataSource)
        console.log("updated")
    }
    const handleShowResetWarning = () => {
        setShowResetModal(true)
    }
    const handleCloseResetWarning = () => {
        setShowResetModal(false)
    }
    const handleResetDataSource = () => {
        let action = dataSourceReset({dataSourceId: dataSourceId})
        dispatch(action)
        setShowResetModal(false)
    }

    let {dataSourceId} = props
    let dataSource = useSelector(state => {
        if (dataSourceId) {
            return selectDataSourceById(state, dataSourceId)
        }
    })

    if (dataSource) {
        let {
            patternKits,
            baseUri,
            clazz,
        } = dataSource

        let patternKitsDisplay
        if (patternKits && patternKits.length > 0) {
            let groupedPatternKits = patternKits.reduce((reducer, patternKit) => {
                // todo - make this an object instead of array
                reducer[patternKit.clazz] = reducer[patternKit.clazz] || []
                reducer[patternKit.clazz].push(patternKit)
                return reducer
            }, Object.create(null))
            patternKitsDisplay = Object.entries(groupedPatternKits).map(( patternKitGroup) => {
                let fqName = patternKitGroup[0];
                let type = getClassName(fqName)
                let patternKits = patternKitGroup[1];
                return (
                    <PatternKitTypeGroup key={type} type={type}>
                        {
                            patternKits.map(patternKit => <PatternKitDisplay key={patternKit.id} patternKitId={patternKit.id} />)
                        }
                    </PatternKitTypeGroup>
                )
            })
        } else {
            patternKitsDisplay =
                <InfoMessage>
                    There are currently no Pattern Kits for this Data Source. <br/> Click below to add one.
                </InfoMessage>
        }

        let type = getClassName(clazz)
        return (
            <CollapsableContainer _key={dataSourceId} title="TODO: Add title field to data sources">
                <Modal show={showResetModal}>
                    <Header onHide={handleCloseResetWarning}>Reset changes to Data Source?</Header>
                    <Body>
                        <p>Are you sure you want to reset all changes to this Data Source?</p>
                        <strong>This cannot be undone.</strong>
                    </Body>
                    <Footer>
                        <CancelButton clickHandler={handleCloseResetWarning}/>
                        <OKButton clickHandler={handleResetDataSource}>RESET</OKButton>
                    </Footer>
                </Modal>

                <form className="Data-source-field-list">
                    <div>
                        <label htmlFor="data-source-clazz">Type:</label>
                        <input type="text" name="data-source-clazz" value={type}
                               size={type != null ? type.length : DEFAULT_FIELD_SIZE} disabled />
                    </div>
                    <div>
                        <label htmlFor="data-source-base-uri">Base URI:</label>
                        <input type="text" name="data-source-base-uri"
                               value={baseUri} onChange={onBaseUriValChanged}
                               size={baseUri != null ? baseUri.length : DEFAULT_FIELD_SIZE} />
                    </div>
                    <div>
                        <label>Pattern Kits:</label>
                        <div style={{padding: '1rem'}}>
                            {patternKitsDisplay}
                        </div>
                    </div>
                </form>
                <div style={{textAlign: 'right', padding: '2rem'}}>
                    <button className="Small-button" onClick={onAddNewPatternKit}>Add Pattern Kit...</button>
                </div>
                <div className={"Button-container"} style={{padding: '2rem'}}>
                    <CancelButton clickHandler={handleShowResetWarning}>Reset</CancelButton>
                    <OKButton clickHandler={onSaveDataSource}>Save</OKButton>
                </div>
            </CollapsableContainer>
        )
    }
}
