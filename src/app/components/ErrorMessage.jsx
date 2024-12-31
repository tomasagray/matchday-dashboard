import React from 'react'

export const ErrorMessage = (props) => {

    let {children, code} = props

    return (
        <div className="Message">
            <img src={process.env.PUBLIC_URL + '/img/icon/error/error_128.png'}
                 alt="ERROR" className={"error"}/>
            <div className="Message-description-container">
                <h1 className="Message-title">ERROR</h1>
                <p className="Message-description">{children}</p>
                <p className="Message-code">{code}</p>
            </div>
        </div>
    )
}
