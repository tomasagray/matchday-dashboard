import React from "react"

export const CancelButton = (props) => {

    let {children, onClick, disabled, style} = props
    let content = children ?? "Cancel"
    return (
        <button className={"Cancel-button"} onClick={onClick}
                disabled={disabled} style={style}>
            {content}
        </button>
    )
}
