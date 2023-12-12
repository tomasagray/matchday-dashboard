import React from "react"

export const Modal = (props) => {

    let modalClass = "Modal"
    let containerClass = "Modal-container"
    if (!props.show) {
        modalClass += " hidden"
        containerClass += " hidden"
    }

    return (
        <div className={containerClass}>
            <div className={modalClass}>
                <Dialog>
                    {props.children}
                </Dialog>
            </div>
        </div>
    );
}
export default Modal

export const Dialog = (props) => {

    let children = props.children
    return (
        <div className={"Dialog"}>
            {children}
        </div>
    )
}

export const Header = (props) => {

    let {onHide} = props

    return (
        <div className={"Modal-header"}>
            <div className={"Modal-header-title"}>
                <h2>{props.children}</h2>
            </div>
            <button className={"Close-button"} onClick={onHide}></button>
        </div>
    )
}

export const Body = (props) => {

    return (
        <div className={"Modal-body"} style={props.style}>
            {props.children}
        </div>
    )
}

export const Footer = (props) => {

    return (
        <div className={"Modal-footer"}>
            <div className={"Button-container"}>
                {props.children}
            </div>
        </div>
    )
}
