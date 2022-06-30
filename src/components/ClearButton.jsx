import React from "react";

export const ClearButton = (props) => {

    return (
        <button className={"Clear-button"} style={props.style} onClick={props.onClick}>
            <img src={process.env.PUBLIC_URL + '/img/icon/clear/clear_16.png'} alt={"Clear selection"}/>
        </button>
    )
}
