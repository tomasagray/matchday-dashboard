import React from "react";


export const AccordionDisplay = (props) => {
    return (
        <div className={"Accordion-display" + (props.isShown ? ' displayed' : '')}>
            {props.children}
        </div>
    )
}