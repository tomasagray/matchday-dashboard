import React from "react";

export const AccordionHeader = (props) => {

    let {children, onClick, isExpanded} = props
    let indicatorClass = 'Accordion-expanded-indicator' + (isExpanded ? ' expanded' : '')

    return (
        <div className="Accordion-header" onClick={onClick}>
            {children}
            <span className={indicatorClass}>+</span>
        </div>
    )
}