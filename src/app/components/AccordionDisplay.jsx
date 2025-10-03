import React from "react";


export const AccordionDisplay = (props) => {

    let {isShown, children} = props

    return (
        <div className={"Accordion-display" + (isShown ? ' displayed' : '')}>
            {children}
        </div>
    )
}