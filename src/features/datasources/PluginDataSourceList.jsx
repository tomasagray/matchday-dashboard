import React from 'react'
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useGetDataSourcesForPluginQuery} from "./dataSourceApiSlice";
import {selectDataSourcePluginById} from "../datasource-plugins/dataSourcePluginSlice";
import {useGetAllDataSourcePluginsQuery} from "../datasource-plugins/dataSourcePluginApiSlice";
import {PluginId} from "../datasource-plugins/PluginId";
import {Spinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";
import {DataSourceDisplay} from "./DataSourceDisplay";
import {InfoMessage} from "../../components/InfoMessage";

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
            dataSourceList =
                dataSources.ids.map(dataSourceId =>
                        <DataSourceDisplay key={dataSourceId} dataSourceId={dataSourceId}/>
                )
        } else {
            dataSourceList =
                <InfoMessage>
                    There are currently no Data Sources for this plugin.<br/> Click above to add one
                </InfoMessage>
        }
    }
    if (isLoading) {
        dataSourceList =
            <div className="loading-box">
                <Spinner text="Loading..."/>
            </div>
    }
    if (isError) {
        dataSourceList = <ErrorMessage code={error.status}>{error}</ErrorMessage>
    }
    return (dataSourceList)
}

export const PluginDataSourceList = () => {

    let params = useParams()
    const {pluginId} = params;

    // ensure data is loaded into store
    let {isLoading: pluginLoading, isSuccess: pluginSuccess} = useGetAllDataSourcePluginsQuery()
    let plugin = useSelector(state => {
        if (pluginSuccess) {
            return selectDataSourcePluginById(state, pluginId)
        }
    })
    let pluginContent
    if (pluginSuccess) {
        pluginContent = <h1>{plugin.title}</h1>
    }
    if (pluginLoading) {
        pluginContent = <Spinner size={32}/>
    }

    const onAddNewDataSource = (e) => {
        console.log('button clicked:', e)
    };

    return (
        <>
            <div className="Banner-title">
                {pluginContent}
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
