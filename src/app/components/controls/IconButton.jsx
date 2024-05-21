import React from 'react';

export const IconButton = (props) => {

    let {
        children,
        iconUrl,
        onClick,
        disabled,
        style,
        className
    } = props

    return (
        <>
            <button onClick={onClick} disabled={disabled} className={className} style={style}>
                {children}
                <img src={iconUrl} alt={""} className={"Button-icon"}/>
            </button>
        </>
    )
}