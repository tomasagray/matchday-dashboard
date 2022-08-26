import React from "react";
import {Link} from "react-router-dom";

export const EmptyMessage = (props) => {

    let {noun} = props
    const style = {
        margin: '2rem 0',
        color: '#ccc',
    }
    return (
        <>
            <p style={style}>
                There are currently no <strong>{noun}</strong>.
                Try refreshing the <Link to="/data-sources">data sources</Link>.
            </p>
        </>
    )
}
