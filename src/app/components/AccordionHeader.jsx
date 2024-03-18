import React from "react";

export const AccordionHeader = (props) => {

    let {children, onClick, isExpanded} = props
    let className = 'Accordion-expanded-indicator' + (isExpanded ? ' expanded' : '')

    return (
        <div className="Accordion-header" onClick={onClick}>
            <span className={className}>+</span>
            {children}
        </div>
    )
}