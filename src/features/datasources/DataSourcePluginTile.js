import {useDispatch} from "react-redux";
import {pluginSelected} from "./dataSourcesSlice";
import {PluginId} from "./PluginId";
import React from "react";

export const DataSourcePluginTile = (props) => {

    let plugin = props.plugin
    let className = "Plugin-button-tile " + (props.active ? 'active' : '')
    const dispatch = useDispatch()
    const onPluginTileClicked = () => {
        dispatch(pluginSelected({plugin}))
    }

    return (
        <>
            <div className={className} onClick={onPluginTileClicked}>
                <h2 className="Plugin-button-title">{plugin.title}</h2>
                <PluginId id={plugin.id} />
            </div>
        </>
    )
}
