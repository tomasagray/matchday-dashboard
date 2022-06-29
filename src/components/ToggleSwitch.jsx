import React from 'react'
import {Spinner} from "./Spinner";

export const Status = () => {
    const st = {
        Unchecked: 'Unchecked',
        Checked: 'Checked',
        Transitioning: 'Transitioning'
    }
    return Object.freeze(st)
}

export const ToggleSwitch = ({status = Status().Unchecked, onclick}) => {
    return (
        <>
            <div className={`Toggle-switch ${status}`} onClick={onclick}>
                <span className="slider round">
                    <Spinner size={'1.9rem'} text={''} />
                </span>
            </div>
        </>
    )
}
