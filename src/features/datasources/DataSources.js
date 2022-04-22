import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Spinner} from "../../components/Spinner";
import GridList from "../../components/GridList"
import PluginButtonTile from "./PluginButtonTile"
import {
    pluginSelected,
    useGetAllDataSourcePluginsQuery,
    useRefreshAllDataSourcePluginsMutation
} from "./dataSourcesSlice";
import {PluginDisplay} from "./PluginDisplay";
import {ErrorMessage} from "../../components/ErrorMessage";


let DataSourcePluginTile = ({plugin}) => {
    const dispatch = useDispatch()
    const onPluginTileClicked = () => {
        dispatch(pluginSelected({plugin}))
    }
    return (
        <PluginButtonTile key={plugin.id} datasource={plugin} clickHandler={onPluginTileClicked}/>
    )
}

export default function DataSources() {
    const {
        data: plugins,
        isLoading: pluginsLoading,
        isSuccess: pluginLoaded,
        isError: pluginLoadingError,
        error: pluginError
    } = useGetAllDataSourcePluginsQuery()

    const [
        refreshAllPlugins,
        {
            // data: refreshData,
            isLoading: refreshing,
            // isSuccess: refreshSuccess,
            // isError: isRefreshError,
            // error: refreshError
        }] = useRefreshAllDataSourcePluginsMutation()

    let dataSourceList
    if (pluginsLoading) {
        dataSourceList =
            <div className="loading-box">
                <Spinner text="Loading..." size="2rem"/>
            </div>
    } else if (pluginLoaded) {
        const {_embedded} = plugins;
        const {data_source_plugins: dataSourcePlugins} = _embedded
        let tiles = dataSourcePlugins.map(plugin => <DataSourcePluginTile key={plugin.id} plugin={plugin}/>)
        dataSourceList = <GridList items={tiles}/>
    } else if (pluginLoadingError) {
        dataSourceList = <ErrorMessage message={pluginError.error} code={pluginError.status}/>
    }

    const selectedPlugin = useSelector(state => {
        const {dataSources} = state;
        const {selectedPlugin: plugin} = dataSources;
        return plugin;
    })

    let pluginData
    if (selectedPlugin) {
        pluginData = <PluginDisplay plugin={selectedPlugin}/>
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
