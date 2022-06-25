import React from "react";

export const SaveButton = (props) => {

    const {onClick, style, disabled} = props
    return (
        <button className={"Save-button"} onClick={onClick} style={style} disabled={disabled}>
            {props.children ?? 'Save'}
            <img src={process.env.PUBLIC_URL + '/img/save/save_16.png'} alt={"Save"} />
        </button>
    )
}
