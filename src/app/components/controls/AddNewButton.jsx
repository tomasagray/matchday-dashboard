import React from "react";


export const AddNewButton = (props) => {

    let {onClick, style} = props

    return (
        <button
            onClick={onClick}
            className={'Add-new-button'}
            style={style}
        >
            <div className={'Add-button'}>
                +
            </div>
            Add new ...
        </button>
    )
}