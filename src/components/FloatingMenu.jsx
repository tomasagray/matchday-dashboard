import React from 'react'

export const FloatingMenu = (props) => {

    return (
        <>
            <div className={"Floating-menu " + (props.hidden ? 'hidden' : '')}>
                <ul>{props.children}</ul>
            </div>
        </>
    )
}
