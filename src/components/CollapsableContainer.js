import React, {useState} from "react";

export const CollapsableContainer = (props) => {

    let [expanded, setExpanded] = useState(true)
    const onClickTitleBar = () => {
        setExpanded(!expanded)
    }

    return (
        <>
            <div className="Collapsable-container">
                <div className="Title-bar" onClick={onClickTitleBar}>
                    <h3>{props.title}</h3>
                    <img src={process.env.PUBLIC_URL + '/img/link-arrow_64.png'}
                         alt={"Click to " + (expanded ? 'collapse' : 'expand')}
                         className={expanded ? 'expanded' : ''}/>
                </div>
                <div className={"Content-area " + (expanded ? 'expanded' : '')}>
                    {props.children}
                </div>
            </div>
        </>
    )
}
