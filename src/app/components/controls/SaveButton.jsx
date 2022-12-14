import React from "react";
import {SmallSpinner} from "../Spinner";

export const SaveButton = (props) => {

    const {onClick, style, disabled, isLoading, children} = props
    let content = isLoading ? <SmallSpinner/> : children ?? 'Save'
    let className = 'Save-button' + (isLoading ? ' loading' : '')
    return (
        <button className={className} onClick={onClick} style={style} disabled={disabled}>
            {content}
            <img src={process.env.PUBLIC_URL + '/img/icon/save/save_16.png'} alt={"Save"} className={"Save-icon"} />
        </button>
    )
}
