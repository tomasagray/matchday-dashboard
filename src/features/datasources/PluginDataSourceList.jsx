import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAddDataSourceMutation} from "../../slices/api/dataSourceApiSlice";
import {selectDataSourcePluginById} from "../../slices/dataSourcePluginSlice";
import {
  useGetAllDataSourcePluginsQuery
} from "../../slices/api/dataSourcePluginApiSlice";
import {PluginId} from "../../components/PluginId";
import {Spinner} from "../../components/Spinner";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/controls/CancelButton";
import {AddDataSourceForm} from "./AddDataSourceForm";
import {
  clearNewDataSource,
  selectIsNewDataSourceValid,
  selectNewDataSource
} from "../../slices/dataSourceSlice";
import {DataSourceList} from "./DataSourceList";
import {SaveButton} from "../../components/controls/SaveButton";
import {toast} from "react-toastify";
import {getToastMessage} from "../../app/utils";

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

    const params = useParams()
    let {pluginId} = params
    let newDataSource = useSelector(state => selectNewDataSource(state))
    let [showAddDataSourceModal, setShowAddDataSourceModal] = useState(false)

    let [addDataSource, {
        isLoading: isDataSourceSaving,
        isSuccess: isDataSourceSaveSuccess,
        isError: isSaveDataSourceError,
        error: saveDataSourceError
    }] = useAddDataSourceMutation()
    // ensure data is loaded into store
    let {
        isLoading: pluginLoading,
        isSuccess: pluginSuccess,
        isFetching: isPluginRefetching,
        isError: isPluginError,
        error: pluginError
    } = useGetAllDataSourcePluginsQuery()
    let plugin = useSelector(state => {
        if (pluginSuccess) {
            return selectDataSourcePluginById(state, pluginId)
        }
    })
    let isFormValid = useSelector(state => pluginSuccess && selectIsNewDataSourceValid(state))


    useEffect(() => {
        if (isPluginError) {
            let msg = 'Error loading data source plugins: ' + getToastMessage(pluginError)
            toast.error(msg)
        }
        if (isSaveDataSourceError) {
            let msg = 'Could not save data source: ' + getToastMessage(saveDataSourceError)
            toast.error(msg);
        }
        if (isDataSourceSaveSuccess) {
            toast('DataSource was successfully uploaded')
        }
    },  [
        isSaveDataSourceError,
        saveDataSourceError,
        isDataSourceSaveSuccess,
        isPluginError,
        pluginError
    ])


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
                    <CancelButton onClick={onHideAddDataSourceModal} disabled={isDataSourceSaving}>
                        Discard
                    </CancelButton>
                    <SaveButton
                        onClick={onSaveNewDataSource}
                        disabled={!isFormValid || isDataSourceSaving}
                        isLoading={isDataSourceSaving}
                    />
                </Footer>
            </Modal>
            {
                pluginSuccess ?
                    <>
                        <div className="Banner-title">
                            {pluginTitle} <PluginId id={pluginId}/>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <h2>Data Sources</h2>
                            <button onClick={onAddDataSource} className="Small-button" disabled={isDataFetching}>
                                Add Data Source...
                            </button>
                        </div>
                    </> :
                    null
            }
            <div style={{height: '100%'}}>
                <DataSourceList pluginId={pluginId}/>
            </div>
        </>
    )
}
