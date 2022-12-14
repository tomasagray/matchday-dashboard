import React from "react";

export const CountryTile = (props) => {

    let {name, flag} = props

    return (
        <div className="Country-tile">
            <img src={flag} alt="Flag"/>
            <p>{name}</p>
        </div>
    )
}
