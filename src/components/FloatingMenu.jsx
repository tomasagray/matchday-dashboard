import React, {useRef} from 'react'
import {useClickOutsideComponent} from "../hooks/useClickOutsideComponent";

export const FloatingMenu = (props) => {

    let {onClickOutside: setEditMenuHidden, hidden, style, children} = props
    const menu = useRef(null)
    useClickOutsideComponent(menu, setEditMenuHidden)

    return (
        <div ref={menu}>
            <div className={"Floating-menu " + (hidden ? 'hidden' : '')} style={style}>
                <ul>{children}</ul>
            </div>
        </div>
    )
}
