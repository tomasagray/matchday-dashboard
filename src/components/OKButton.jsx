import React from "react"

export const OKButton = (props) => {

    let content = props.children ? props.children : "OK"
    return (
        <button className={"OK-button"} onClick={props.clickHandler} disabled={props.disabled}>
            {content}
        </button>
    )
}
