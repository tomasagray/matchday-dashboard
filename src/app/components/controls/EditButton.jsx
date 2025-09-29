import React from "react";

export const EditButton = (props) => {

    const {onClick} = props

    return (
        <button className="Edit-button" onClick={onClick}>
            <img src={'/img/icon/edit/edit_16.png'} alt="Edit"/>
        </button>
    )
}
