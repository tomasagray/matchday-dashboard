import React from "react";

export const DownloadButton = (props) => {

    const {onClick, style, disabled, children} = props
    const content = children ?? 'Download'
    return (
        <button onClick={onClick} disabled={disabled} className={"Download-button"} style={style}>
            {content}
            <img src={process.env.PUBLIC_URL + '/img/icon/download/download_16.png'} alt={"Download"}
                 className={"Download-icon"}/>
        </button>
    )
}
