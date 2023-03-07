import React, {useState} from 'react'

export const MenuItem = (props) => {

    // state
    let {backgroundColor, onClick} = props
    let [isHover, setIsHover] = useState(false)

    const onMouseEnter = () => {
        setIsHover(true)
    }
    const onMouseLeave = () => {
        setIsHover(false)
    }

    let style = isHover ? {backgroundColor} : {}
    return (
        <li className="Menu-item" style={style} onClick={onClick} onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            {props.children}
        </li>
    )
}
