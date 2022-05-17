import React from 'react'
import {useSelector} from "react-redux";
import {Spinner} from "../../components/Spinner";
import GridList from "../../components/GridList"
import {
    useGetAllDataSourcePluginsQuery,
    useRefreshAllDataSourcePluginsMutation
} from "./dataSourcesSlice";
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

    const selectedPlugin = useSelector(state => {
        const {dataSources} = state;
        const {selectedPlugin: plugin} = dataSources;
        return plugin;
    })

    let dataSourceList
    if (pluginsLoading) {
        dataSourceList =
            <div className="loading-box">
                <Spinner text="Loading..." size="2rem"/>
            </div>
    } else if (pluginLoaded) {
        let tiles = dataSourcePlugins.map(plugin => {
            let active = selectedPlugin && plugin.id === selectedPlugin.id
            return <DataSourcePluginTile key={plugin.id} active={active} plugin={plugin}/>;
        })
        dataSourceList = <GridList items={tiles}/>
    } else if (pluginLoadingError) {
        dataSourceList = <ErrorMessage message={pluginError.error} code={pluginError.status}/>
    }

    let pluginData
    if (selectedPlugin) {
        pluginData = <PluginDetailDisplay plugin={selectedPlugin}/>
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
                <img src={process.env.PUBLIC_URL + '/img/plugin_128.png'} alt="Plugins"
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
