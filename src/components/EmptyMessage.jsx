import React from "react";
import {Link} from "react-router-dom";
import {InfoMessage} from "./InfoMessage";

export const EmptyMessage = (props) => {

    let {noun} = props
    const style = {
        margin: '2rem 0',
        display: 'block',
        color: '#ccc',
    }
    return (
        <InfoMessage>
            <span style={style}>
                There are currently no <strong>{noun}</strong>.
                Try refreshing the <Link to="/data-sources">data sources</Link>.
            </span>
        </InfoMessage>
    )
}
