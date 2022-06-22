import React, {useRef} from 'react'
import {useClickOutsideComponent} from "../hooks/useClickOutsideComponent";

export const FloatingMenu = (props) => {

    let {onClickOutside: setEditMenuHidden} = props
    const menu = useRef(null)
    useClickOutsideComponent(menu, setEditMenuHidden)

    return (
        <div ref={menu}>
            <div className={"Floating-menu " + (props.hidden ? 'hidden' : '')} style={props.style}>
                <ul>{props.children}</ul>
            </div>
        </div>
    )
}
