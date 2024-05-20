import React from "react";
import {SmallSpinner} from "../Spinner";
import {IconButton} from "./IconButton";

export const SaveButton = (props) => {

    const {onClick, style, disabled, isLoading, children} = props
    let content = isLoading ? <SmallSpinner/> : children ?? 'Save'
    let className = 'Save-button' + (isLoading ? ' loading' : '')
    return (
        <IconButton
            iconUrl={'/img/icon/save/save_16.png'}
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={style}>
            {content}
        </IconButton>
    )
}
