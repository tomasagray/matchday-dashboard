import React from "react";

export default function GridList(props) {
    if (props.items === undefined) {
        return null;
    }
    return (
        <>
            <ul className="Grid-list">
                {
                    props.items.map((item, idx) => {
                        return (
                            <li key={idx} className="Grid-item"> {item} </li>
                        );
                    })
                }
            </ul>
        </>
    );
};
