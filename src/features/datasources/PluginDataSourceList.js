import React, {useMemo} from 'react'
import {useParams} from "react-router-dom";
import {useGetAllDataSourcePluginsQuery, useGetDataSourcesForPluginQuery} from "./dataSourcesSlice";
import {PluginId} from "./PluginId";
import {Spinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";
import {DataSourceDisplay} from "./DataSourceDisplay";

const DataSources = (props) => {

    let {pluginId} = props
    const {
        data: dataSources,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetDataSourcesForPluginQuery(pluginId)

    let dataSourceList
    if (isSuccess) {
        if (dataSources) {
            dataSourceList = dataSources.map(dataSource =>
                <DataSourceDisplay key={dataSource.dataSourceId} dataSource={dataSource}/>
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
    return (dataSourceList)
}

export const PluginDataSourceList = () => {

    let params = useParams()
    const {pluginId} = params;
    const {
        data: plugins = [],
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAllDataSourcePluginsQuery()
    const plugin = useMemo(() =>
            plugins.find(plugin => plugin.id === pluginId),
        [plugins, pluginId])

    const onAddNewDataSource = (e) => {
        console.log('button clicked:', e)
    }

    if (isError) {
        return <ErrorMessage message={error}/>
    }
    if (isLoading) {
        return <Spinner size={64}/>;
    }
    if (isSuccess) {
        return (
            <>
                <div className="Banner-title">
                    <h1>{plugin.title}</h1>
                    <PluginId id={pluginId}/>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h2>Data Sources</h2>
                    <button onClick={onAddNewDataSource} className="Small-button">Add Data Source...</button>
                </div>
                <div>
                    <DataSources pluginId={pluginId}/>
                </div>
            </>
        );
    }
}
