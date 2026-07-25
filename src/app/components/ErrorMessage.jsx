import React from 'react'

export const ErrorMessage = (props) => {

    let {children, code} = props

    return (
        <div className="Message">
            <img src={'/img/icon/error/error_128.png'}
                 alt="ERROR" className={"error"}/>
            <div className="Message-description-container">
                <h1 className="Message-title">ERROR</h1>
                <div className="Message-description">{children}</div>
                <div className="Message-code">{code}</div>
            </div>
        </div>
    )
}
