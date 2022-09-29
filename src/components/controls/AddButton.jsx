import React from "react";

export const AddButton = (props) => {

    let {onClick} = props

    const handleClick = (e) => {
        onClick && onClick(e)
    }

    return (
        <button className="Add-button" onClick={handleClick}>+</button>
    )
}
