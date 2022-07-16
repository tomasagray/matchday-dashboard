import React from "react";

export default function GridList(props) {

    const {items} = props

    return (
        <>
            <ul className="Grid-list">
                {
                    items.map((item, idx) => {
                        return (
                            <li key={idx} className="Grid-item"> {item} </li>
                        );
                    })
                }
            </ul>
        </>
    );
};
