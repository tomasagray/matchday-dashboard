import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Spinner} from "../../components/Spinner";
import GridList from "../../components/GridList"
import PluginButtonTile from "./PluginButtonTile"
import {useGetAllDataSourcePluginsQuery} from "../../app/apiSlice";
import {pluginSelected} from "./dataSourcesSlice"
import {PluginDisplay} from "./PluginDisplay";


let DataSourcePluginTile = ({plugin}) => {
    const dispatch = useDispatch()
    const onPluginTileClicked = () => {
        dispatch(pluginSelected({plugin}))
    }
    return (
        <PluginButtonTile key={plugin.id} datasource={plugin} clickHandler={onPluginTileClicked}/>
    )
}

export default function Datasources() {
    const {
        data: plugins,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAllDataSourcePluginsQuery()

    let dataSourceList
    if (isLoading) {
        dataSourceList =
            <div className="loading-box">
                <Spinner text="Loading..." size="2rem"/>
            </div>
    } else if (isSuccess) {
        const {_embedded} = plugins;
        const {data_source_plugins: dataSourcePlugins} = _embedded
        let tiles = dataSourcePlugins.map(plugin => <DataSourcePluginTile plugin={plugin}/>)
        dataSourceList = <GridList items={tiles}/>
    } else if (isError) {
        dataSourceList = <p>Error: {error.toString()}</p>
    }

    const selectedPlugin = useSelector(state => {
        const {datasources} = state;
        const {selectedPlugin: plugin} = datasources;
        return plugin;
    })

    let pluginData
    if (selectedPlugin) {
        pluginData = <PluginDisplay plugin={selectedPlugin}/>
    } else if (isSuccess) {
        pluginData = <p>Please select a Data Source plugin from above.</p>
    }

    const onRefreshAllPlugins = () => {
        console.log('refresh button clicked')
    }

    return (
        <>
            <div className="section-header">
                <img src={process.env.PUBLIC_URL + '/img/plugin_128.png'} alt="Plugins"
                     style={{height: 'fit-content'}}/>
                <h1>Plugins</h1>
                <button className="Small-button" disabled={isLoading} onClick={onRefreshAllPlugins}>
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
