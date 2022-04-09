import React from 'react'

export const Spinner = ({text = '', size = ''}) => {
    const header = text ? <div style={{margin: '1rem'}}> <h4>{text}</h4> </div> : null
    return (
        <div className="spinner" style={{width: size, height: size}}>
            {header}
            <div className="loader">
                <img src={process.env.PUBLIC_URL + '/img/spinner/spinner_128.png'} alt="spinner"/>
            </div>
        </div>
    )
}
