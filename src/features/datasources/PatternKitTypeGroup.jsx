import React from 'react'

export const PatternKitTypeGroup = (props) => {

    return (
        <div className="Pattern-kit-display" key={props.type}>
            <div>
                {props.children}
            </div>
        </div>
    )
}
