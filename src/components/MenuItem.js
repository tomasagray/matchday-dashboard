import React, {useState} from 'react'

export const MenuItem = (props) => {

    let [isHover, setIsHover] = useState(false)

    const onMouseEnter = () => {
        setIsHover(true)
    }

    const onMouseLeave = () => {
        setIsHover(false)
    }

    let style = isHover ? {backgroundColor: props.backgroundColor} : {};
    return (
        <>
            <li className="Menu-item" style={style} onClick={props.onClick} onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}>
                {props.children}
            </li>
        </>
    )
}
