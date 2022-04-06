export default function PluginButtonTile({clickHandler, datasource: plugin}) {
    return (
        <>
            <div className="Plugin-button-tile" onClick={clickHandler}>
                <h3 className="Plugin-button-tile-title">{plugin.title}</h3>
                <p><strong>ID:</strong> {plugin.id}</p>
                <p className="Plugin-button-tile-description">{plugin.description}</p>
            </div>
        </>
    )
}
