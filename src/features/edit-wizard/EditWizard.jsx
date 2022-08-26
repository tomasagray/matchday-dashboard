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
        <div>
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
