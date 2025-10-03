import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useGetAllDataSourcePluginsQuery, useGetDataSourcePluginQuery} from "../../slices/api/dataSourcePluginApiSlice";
import {PluginId} from "../../components/PluginId";
import {Spinner} from "../../components/Spinner";
import {AddDataSourceForm} from "../datasources/AddDataSourceForm";
import {clearNewDataSource} from "../../slices/dataSourceSlice";
import {DataSourceList} from "../datasources/DataSourceList";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";


export const DataSourcePluginDisplay = () => {

    const dispatch = useDispatch()
    const onAddDataSource = () => setShowAddDataSourceModal(true)
    const onHideAddDataSourceModal = () => {
        dispatch(clearNewDataSource({}))
        setShowAddDataSourceModal(false)
    }

    const params = useParams()
    let {pluginId} = params
    let [showAddDataSourceModal, setShowAddDataSourceModal] = useState(false)

    // ensure data is loaded into store
    let {
        data: plugin,
        isLoading: pluginLoading,
        isSuccess: pluginSuccess,
        isFetching: isPluginRefetching,
        isError: isPluginError,
        error: pluginError
    } = useGetDataSourcePluginQuery(pluginId)

    // state

    useEffect(() => {
        if (isPluginError) {
            let msg = 'Error loading data source plugins: ' + getToastMessage(pluginError)
            toast.error(msg)
        }

    }, [
        isPluginError,
        pluginError
    ])


    let isDataFetching = pluginLoading || isPluginRefetching;
    let pluginTitle = pluginSuccess ?
        <h1>{plugin.title}</h1> :
        isDataFetching ? <Spinner size={'32px'} text={''}/> :
            ''

    return (
        <>
            <AddDataSourceForm
                pluginId={pluginId}
                onHide={onHideAddDataSourceModal}
                isShown={showAddDataSourceModal}/>
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
