import React from "react";
import {IconButton} from "./IconButton";

export const DownloadButton = (props) => {

    const {onClick, style, disabled, children} = props
    const content = children ?? 'Download'
    return (
        <IconButton
            iconUrl={'/img/icon/download/download_32.png'}
            onClick={onClick}
            disabled={disabled}
            className={"Download-button"}
            style={style}>
            {content}
        </IconButton>
    )
}
