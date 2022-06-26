import React from "react";
import {Link, useLocation} from "react-router-dom";

export const NavButton = (props) => {

    const location = useLocation()
    const {pathname} = location
    const isCurrent = pathname.startsWith(props.href)
    const altText = props.href?.substring(1, props.href.length) ?? ''

    return (
        <li>
            <Link to={props.href}>
                <button className={"Nav-link" + (isCurrent ? ' current' : '')}>
                    <img src={process.env.PUBLIC_URL + props.icon} alt={altText} />
                </button>
            </Link>
        </li>
    )
}
