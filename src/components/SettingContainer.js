import React from 'react'

export const SettingContainer = (props) => {

    return (
        <>
            <div className={` ${props.className} Setting-container`}>
                {props.children}
            </div>
        </>
    )
}
