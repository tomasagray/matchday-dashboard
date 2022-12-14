import React from "react";
import {SmallSpinner} from "../Spinner";

export const DeleteButton = (props) => {

    const {style, onClick, disabled, isLoading, children} = props
    let content = isLoading ? <SmallSpinner/> : children ?? 'DELETE'
    return (
        <button onClick={onClick} disabled={disabled} className={"Delete-button"} style={style}>
            {content}
            <img src={process.env.PUBLIC_URL + '/img/icon/delete/delete_16.png'} alt={"Delete"}
                className={"Delete-icon"}/>
        </button>
    )
}
