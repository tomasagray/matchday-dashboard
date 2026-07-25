import React from "react";


export const AccordionDisplay = (props) => {

    let {isShown, isClosing, onFinished, children} = props
    let className = isClosing ? ' closing' : isShown ? ' displayed' : ''

    return (
        <div className={"Accordion-display" + className} onAnimationEnd={onFinished}>
            {children}
        </div>
    )
}