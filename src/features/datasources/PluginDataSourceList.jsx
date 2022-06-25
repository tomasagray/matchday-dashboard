import React, {useState} from 'react'
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAddDataSourceMutation} from "./dataSourceApiSlice";
import {selectDataSourcePluginById} from "../datasource-plugins/dataSourcePluginSlice";
import {useGetAllDataSourcePluginsQuery} from "../datasource-plugins/dataSourcePluginApiSlice";
import {PluginId} from "../datasource-plugins/PluginId";
import {Spinner} from "../../components/Spinner";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/CancelButton";
import {AddDataSourceForm} from "./AddDataSourceForm";
import {clearNewDataSource, selectIsNewDataSourceValid, selectNewDataSource} from "./dataSourceSlice";
import {DataSourceList} from "./DataSourceList";
import {SaveButton} from "../../components/SaveButton";

export const PluginDataSourceList = () => {

    const dispatch = useDispatch()
    const onAddDataSource = () => {
        setShowAddDataSourceModal(true)
    }
    const onHideAddDataSourceModal = () => {
        dispatch(clearNewDataSource({}))
        setShowAddDataSourceModal(false)
    }
    const onSaveNewDataSource = async () => {
        // transform form data into DataSource
        let dataSource = {
            dataSourceId: null,
            clazz: newDataSource.type.value,
            title: newDataSource.title.value,
            baseUri: newDataSource.baseUri.value,
            pluginId: pluginId,
            patternKits: [],
        }
        console.log('saving:', dataSource)
        await addDataSource(dataSource)
        dispatch(clearNewDataSource({}))
        setShowAddDataSourceModal(false)
    }
    let [addDataSource, {
        isLoading: isDataSourceSaving,
        isSuccess: isDataSourceSaveSuccess,
        isError: isSaveDataSourceError,
        error: saveDataSourceError
    }] = useAddDataSourceMutation()


    const params = useParams()
    let {pluginId} = params;
    let newDataSource = useSelector(state => selectNewDataSource(state))
    let [showAddDataSourceModal, setShowAddDataSourceModal] = useState(false)
    // ensure data is loaded into store
    let {
        isLoading: pluginLoading,
        isSuccess: pluginSuccess,
        isFetching: isPluginRefetching,
    } = useGetAllDataSourcePluginsQuery()
    let plugin = useSelector(state => {
        if (pluginSuccess) {
            return selectDataSourcePluginById(state, pluginId)
        }
    })
    let isFormValid = useSelector(state => {
        if (pluginSuccess) {
            return selectIsNewDataSourceValid(state)
        }
    })

    // todo - handle these
    if (isSaveDataSourceError) {
        console.log('error', saveDataSourceError)
    }
    if (isDataSourceSaving) {
        console.log('saving saving saving.')
    }
    if (isDataSourceSaveSuccess) {
        console.log('saving was successful')
    }


    let pluginTitle
    let isDataFetching = pluginLoading || isPluginRefetching;
    if (pluginSuccess) {
        pluginTitle = <h1>{plugin.title}</h1>
    }
    if (isDataFetching) {
        pluginTitle = <Spinner size={32} text={''} />
    }

    return (
        <>
            <Modal show={showAddDataSourceModal}>
                <Header onHide={onHideAddDataSourceModal}>Add New Data Source</Header>
                <Body>
                    <AddDataSourceForm pluginId={pluginId} disabled={isDataSourceSaving} />
                </Body>
                <Footer>
                    <CancelButton clickHandler={onHideAddDataSourceModal} disabled={isDataSourceSaving}>Discard</CancelButton>
                    <SaveButton onClick={onSaveNewDataSource} disabled={!isFormValid || isDataSourceSaving} />
                </Footer>
            </Modal>

            <div className="Banner-title">
                {pluginTitle}
                <PluginId id={pluginId}/>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h2>Data Sources</h2>
                <button onClick={onAddDataSource} className="Small-button" disabled={isDataFetching}>
                    Add Data Source...
                </button>
            </div>
            <div>
                <DataSourceList pluginId={pluginId}/>
            </div>
        </>
    );
}
