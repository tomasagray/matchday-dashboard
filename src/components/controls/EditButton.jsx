import React from "react";

export const EditButton = (props) => {

    const {onClick} = props

    return (
        <button className="Edit-button" onClick={onClick}>
            <img src={process.env.PUBLIC_URL + '/img/icon/edit-pencil/edit-pencil_16.png'} alt="Edit" />
        </button>
    )
}
