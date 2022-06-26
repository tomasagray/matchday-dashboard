import React from 'react'
import {useSelector} from "react-redux";
import {Spinner} from "../../components/Spinner";
import GridList from "../../components/GridList"
import {useGetAllDataSourcePluginsQuery, useRefreshAllDataSourcePluginsMutation} from "./dataSourcePluginApiSlice";
import {PluginDetailDisplay} from "./PluginDetailDisplay";
import {ErrorMessage} from "../../components/ErrorMessage";
import {DataSourcePluginTile} from "./DataSourcePluginTile";

export const DataSourcePluginsList = () => {
    const {
        data: dataSourcePlugins,
        isLoading: pluginsLoading,
        isSuccess: pluginLoaded,
        isError: pluginLoadingError,
        error: pluginError
    } = useGetAllDataSourcePluginsQuery()

    const [refreshAllPlugins, {isLoading: refreshing}] = useRefreshAllDataSourcePluginsMutation()
    const selectedPluginId = useSelector(state => state.dataSourcePlugins.selectedPluginId)

    let dataSourceList
    if (pluginsLoading) {
        dataSourceList =
            <div className="Loading-box">
                <Spinner/>
            </div>
    } else if (pluginLoaded) {
        let tiles = dataSourcePlugins.ids.map(pluginId => {
            let active = selectedPluginId !== null && pluginId === selectedPluginId
            return <DataSourcePluginTile key={pluginId} active={active} pluginId={pluginId}/>;
        })
        dataSourceList = <GridList items={tiles}/>
    } else if (pluginLoadingError) {
        dataSourceList = <ErrorMessage code={pluginError.status}>{pluginError.error}</ErrorMessage>
    }

    let pluginData
    if (selectedPluginId && !pluginsLoading) {
        pluginData = <PluginDetailDisplay plugin={selectedPluginId}/>
    } else if (pluginLoaded) {
        pluginData = <p>Please select a Data Source plugin from above.</p>
    }

    const onRefreshAllPlugins = async () => {
        await refreshAllPlugins()
    }

    let refreshDisabled = pluginsLoading || pluginLoadingError || refreshing;
    let refreshButtonStyle = pluginsLoading || refreshing ? {cursor: 'wait'} : {}
    return (
        <>
            <div className="section-header">
                <img src={process.env.PUBLIC_URL + '/img/icon/plugins/plugins_64.png'} alt="Plugins"
                     style={{height: 'fit-content'}}/>
                <h1>Plugins</h1>
                <button className="Small-button" style={refreshButtonStyle} disabled={refreshDisabled}
                        onClick={onRefreshAllPlugins}>
                    Refresh All
                </button>
            </div>
            <div style={{margin: '2rem 0'}}>{dataSourceList}</div>
            <div className="plugin-details-container">
                {pluginData}
            </div>
        </>
    );
}
