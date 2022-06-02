import React from "react"


export const Modal = (props) => {

    let className = "Modal"
    if (!props.show) {
        className += " hidden"
    }
    return (
        <div className={className}>
            <Dialog>
                {props.children}
            </Dialog>
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
        <div className={"Modal-body"}>
            {props.children}
        </div>
    )
}

export const Footer = (props) => {

    return (
        <div className={"Modal-footer"}>
            <div className={"button-container"}>
                {props.children}
            </div>
        </div>
    )
}
