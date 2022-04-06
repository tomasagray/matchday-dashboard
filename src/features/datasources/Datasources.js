import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Spinner} from "../../components/Spinner";
import GridList from "../../components/GridList"
import PluginButtonTile from "../../components/PluginButtonTile"
import {useGetAllDataSourcePluginsQuery} from "../../app/apiSlice";
import {pluginSelected} from "./dataSourcesSlice"
import {ToggleSwitch} from "../../components/ToggleSwitch";

let PluginDisplay = ({plugin}) => {
    return (
        <>
            <div className="settingContainer">
                <p><strong>Enabled</strong></p>
                <ToggleSwitch enabled={plugin.enabled}/>
            </div>
        </>
    )
}

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
        dataSourceList = <Spinner text="Loading..."/>
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
    } else {
        pluginData = <p>Please select a Data Source plugin from above.</p>
    }

    return (
        <>
            <h2>Plugins</h2>
            <div>{dataSourceList}</div>
            <div className="plugin-details-container">
                {pluginData}
            </div>
        </>
    );
}
