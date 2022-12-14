import React, {useRef} from 'react'
import {useClickOutsideComponent} from "../hooks/useClickOutsideComponent";

export const FloatingMenu = (props) => {

    let {
        onClickOutside: setEditMenuHidden,
        hidden,
        children,
        style,
        className,
    } = props
    let baseClass = "Floating-menu " + (hidden ? 'hidden' : '')
    const menu = useRef(null)
    useClickOutsideComponent(menu, setEditMenuHidden)

    return (
        <div ref={menu}>
            <div className={`${baseClass} ${className ?? ''}`} style={style}>
                <ul>{children}</ul>
            </div>
        </div>
    )
}
