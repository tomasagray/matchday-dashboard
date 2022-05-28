import {useDispatch, useSelector} from "react-redux";
import {pluginSelected} from "./dataSourcePluginSlice";
import {PluginId} from "./PluginId";
import React from "react";
import {selectDataSourcePluginById} from "./dataSourcePluginSlice";

export const DataSourcePluginTile = (props) => {

    let plugin = useSelector(state => selectDataSourcePluginById(state, props.pluginId))
    const dispatch = useDispatch()
    const onPluginTileClicked = () => dispatch(pluginSelected(plugin.id))

    return (
        <>
            <div className={"Plugin-button-tile " + (props.active ? 'active' : '')} onClick={onPluginTileClicked}>
                <h2 className="Plugin-button-title">{plugin.title}</h2>
                <PluginId id={plugin.id} />
            </div>
        </>
    )
}
