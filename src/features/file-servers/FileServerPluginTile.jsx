import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {PluginId} from "../../components/PluginId";
import {
  pluginSelected,
  selectSelectedPluginId
} from "../../slices/fileServerPluginSlice";

export const FileServerPluginTile = (props) => {

    let {pluginId, title} = props
    const dispatch = useDispatch()
    const onPluginTileClicked = () => dispatch(pluginSelected(pluginId))
    let selectedPluginId = useSelector(state => selectSelectedPluginId(state))

    return (
        <>
            <div className={"Plugin-button-tile " + (selectedPluginId === pluginId ? 'active' : '')} onClick={onPluginTileClicked}>
                <h2 className="Plugin-button-title">{title}</h2>
                <PluginId id={pluginId} />
            </div>
        </>
    )
}
