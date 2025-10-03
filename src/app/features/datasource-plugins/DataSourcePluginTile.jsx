import {useDispatch} from "react-redux";
import {pluginSelected} from "../../slices/dataSourcePluginSlice";
import {PluginId} from "../../components/PluginId";
import React from "react";

export const DataSourcePluginTile = (props) => {

    let {plugin, active} = props

    const dispatch = useDispatch()
    const onPluginTileClicked = () => dispatch(pluginSelected(plugin.id))

    return (
        <>
            <div className={"Plugin-button-tile " + (active ? 'active' : '')} onClick={onPluginTileClicked}>
                <h2 className="Plugin-button-title">{plugin.title}</h2>
                <PluginId id={plugin.id} />
            </div>
        </>
    )
}
