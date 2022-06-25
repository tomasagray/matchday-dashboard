import React from "react";

export const DeleteButton = (props) => {

    const {onClick, disabled, style} = props
    return (
        <button onClick={onClick} disabled={disabled} className={"Delete-button"} style={style}>
            {props.children ?? 'DELETE'}
            <img src={process.env.PUBLIC_URL + '/img/delete/delete_16.png'} alt={"Delete"}/>
        </button>
    )
}
