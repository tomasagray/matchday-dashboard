import React from "react";

export const Option = (props) => {

    let {className = '', onClick, children} = props
    return (
        <li className={"Select-option " + className} onClick={onClick}>
            {children}
        </li>
    )
}
