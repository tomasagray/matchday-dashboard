import React from "react";

export const WarningMessage = (props) => {

    return (
        <div className="Message" style={props.style}>
            <img src={'/img/icon/warning/warning_128.png'}
                 alt="Important information" className={'warning'}/>
            <div className="Message-description-container">
                <h1 className="Message-title">WARNING</h1>
                <p className="Message-description">{props.children}</p>
            </div>
        </div>
    )
}
