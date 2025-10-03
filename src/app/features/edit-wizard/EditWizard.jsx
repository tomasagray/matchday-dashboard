import React from "react";

export const EditWizard = (props) => {

    // state
    let {children} = props

    return (
        <>
            <div className="Edit-wizard-container">
                {children}
            </div>
        </>
    )
}

export const EditWizardMenu = (props) => {

    return (
        <div style={{display: 'flex', height: '120%'}}>
            <ul className="Edit-wizard-menu">
                {props.children}
            </ul>
        </div>
    )
}

export const EditWizardDisplay = (props) => {

    return (
        <div className="Edit-wizard-display">
            {props.children}
        </div>
    )
}
