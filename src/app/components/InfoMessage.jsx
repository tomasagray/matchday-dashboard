import React from 'react'

export const InfoMessage = (props) => {

    return (
        <div className="Message" style={props.style}>
            <img src={'/img/icon/info/info_128.png'}
                 alt="Important information" className={'info'}/>
            <div className="Message-description-container">
                <h1 className="Message-title">INFO</h1>
                <p className="Message-description">{props.children}</p>
            </div>
        </div>
    )
}
