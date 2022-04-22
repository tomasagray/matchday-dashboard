import React from 'react'
import {useParams} from "react-router-dom";
import {
    selectDataSourcePluginById,
    useGetDataSourcesForPluginQuery
} from "./dataSourcesSlice";
import {useSelector} from "react-redux";
import {PluginId} from "./PluginId";
import {Spinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";
import {DataSourceDisplay} from "./DataSourceDisplay";

export const DataSourceList = () => {

    let params = useParams()
    const {pluginId} = params;
    let plugin = useSelector(state => selectDataSourcePluginById(state, pluginId))
    const {
        data: dataSources,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetDataSourcesForPluginQuery(pluginId)

    const onAddNewDataSource = (e) => {
        console.log('button clicked:', e)
    }

    const getDataSourceComponentKey = (id) => {
        let key = 0
        for (let i = 0; i < id.length; i++) {
            key += id.charCodeAt(i)
        }
        return key
    }

    let dataSourceList
    if (isSuccess) {
        if (dataSources) {
            dataSourceList = dataSources.map(dataSource =>
                <DataSourceDisplay key={getDataSourceComponentKey(dataSource.dataSourceId)} datasource={dataSource}/>
            )
        } else {
            dataSourceList = <p>There are currently no Data Sources for this plugin.<br/> Click above to add one</p>
        }
    }
    if (isLoading) {
        dataSourceList =
            <div className="loading-box">
                <Spinner text="Loading..."/>
            </div>
    }
    if (isError) {
        dataSourceList = <ErrorMessage message={error}/>
    }

    let pluginDisplay
    if (plugin) {
        pluginDisplay = (
            <>
                <div className="Banner-title">
                    <h1>{plugin.title}</h1>
                    <PluginId id={pluginId}/>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h2>Data Sources</h2>
                    <button onClick={onAddNewDataSource} className="Small-button">Add Data Source...</button>
                </div>
                <div>{dataSourceList}</div>
            </>
        )
    } else {
        pluginDisplay = <p>No plugin data supplied</p>
    }

    return (
        <>
            {pluginDisplay}
        </>
    );
}
