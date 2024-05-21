import React from 'react'

export const SettingContainer = (props) => {

    let {children, className, style} = props
    return (
        <>
            <div className={`Setting-container ${className}`} style={style}>
                {children}
            </div>
        </>
    )
}
