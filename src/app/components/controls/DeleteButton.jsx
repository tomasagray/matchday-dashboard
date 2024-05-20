import React from "react";
import {SmallSpinner} from "../Spinner";
import {IconButton} from "./IconButton";

export const DeleteButton = (props) => {

    const {style, onClick, disabled, isLoading, children} = props
    let content = isLoading ? <SmallSpinner/> : children ?? 'DELETE'
    return (
        <IconButton
            iconUrl={'/img/icon/delete/delete_16.png'}
            onClick={onClick}
            disabled={disabled}
            className={"Delete-button"}
            style={style}>
            {content}
        </IconButton>
    )
}
