import React from 'react'
import {PluginId} from "./PluginId";

export default function PluginButtonTile({clickHandler = null, datasource: plugin}) {
    return (
        <>
            <div className="Plugin-button-tile" onClick={clickHandler}>
                <h2 className="Plugin-button-title">{plugin.title}</h2>
                <PluginId id={plugin.id} />
            </div>
        </>
    )
}
