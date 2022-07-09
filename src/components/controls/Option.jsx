import React from "react";

export const Option = (props) => {

    return (
        <li className={"Select-option"} onClick={props.onClick}>
            {props.children}
        </li>
    )
}
