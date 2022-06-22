import React from "react"

export const CancelButton = (props) => {

    let content = props.children ? props.children : "Cancel"
    return (
        <button className={"Cancel-button"} onClick={props.clickHandler} disabled={props.disabled}>
            {content}
        </button>
    )
}
