import React, {Component, useRef, useState} from 'react'
import {useClickOutsideComponent} from "../hooks/useClickOutsideComponent";

export const FloatingMenu = (props) => {

    return (
        <>
            <div className={"Floating-menu " + (props.hidden ? 'hidden' : '')}>
                <ul>{props.children}</ul>
            </div>
        </>
    )
}
