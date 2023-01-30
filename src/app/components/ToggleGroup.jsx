import React, {useState} from "react";


// public
export const ToggleOption = () => {
}

// private
const ToggleButton = (props) => {

    let {isSelected, title, onClick} = props
    let className = "Toggle-group-header-button" + (isSelected ? ' selected' : '')
    return (
        <button onClick={onClick} className={className}>
            {title}
        </button>
    )
}

export const ToggleGroupHeader = (props) => {
    return (
        <div className={"Toggle-group-header"}>
            {props.children}
        </div>
    )
}

export const ToggleGroupDisplay = (props) => {
    return (
        <div className={"Toggle-group-display"}>
            {props.children}
        </div>
    )
}

export const ToggleGroup = (props) => {

    let [selected, setSelected] = useState(0)
    let display = props.children[selected].props.children

    return (
        <div className={"Toggle-group"}>
            <ToggleGroupHeader>
                {
                    props.children.map((child, idx) => {
                        return <ToggleButton
                            key={child.props.title}
                            isSelected={idx === selected}
                            onClick={(e) => {
                                e.preventDefault()
                                setSelected(idx)
                                child.props.onSelect && child.props.onSelect()
                            }}
                            {...child.props}
                        />
                    })
                }
            </ToggleGroupHeader>
            <ToggleGroupDisplay>
                {display}
            </ToggleGroupDisplay>
        </div>
    )
}