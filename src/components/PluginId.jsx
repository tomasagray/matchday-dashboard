import React from 'react'

export const PluginId = ({id = ''}) => {
    return (
        <p className="Plugin-id"><strong>Plugin ID:</strong> {id}</p>
    )
}
