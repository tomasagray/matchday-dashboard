import React from 'react'

export default function PluginButtonTile({clickHandler = null, datasource: plugin}) {
    return (
        <>
            <div className="Plugin-button-tile" onClick={clickHandler}>
                <h2 className="Plugin-button-title">{plugin.title}</h2>
                <p className="Plugin-button-id"><strong>ID:</strong> {plugin.id}</p>
            </div>
        </>
    )
}
