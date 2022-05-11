import React from 'react'

export const ErrorMessage = (props) => {

    let message = props.message
    let code = props.code
    return (
        <div className="Error-message">
            <img src={process.env.PUBLIC_URL + '/img/error_128.png'} alt="ERROR"/>
            <div className="Error-description-container">
                <h1 className="Error-title">ERROR</h1>
                <p className="Error-description">{message}</p>
                <p className="Error-code">{code}</p>
            </div>
        </div>
    )
}
