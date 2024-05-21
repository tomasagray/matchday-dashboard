import React, {useState} from "react";
import {FloatingMenu} from "../FloatingMenu";

export const Select = (props) => {

    const selectedContainerStyle = {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipses',
    }

    const onFocus = (focused) => () => {
        setIsFocused(focused)
    }
    const onMenuButtonClick = (e) => {
        e.preventDefault()
        if (!isDisabled) {
            setMenuHidden(false);
        }
    }
    const onMenuItemSelected = (option) => (e) => {
        setMenuHidden(true)
        onChange && onChange(e, option.props.value)
    }

    let {
        disabled: isDisabled,
        selectedIndex,
        selectedValue,
        onChange,
        style,
        className,
    } = props
    let [isFocused, setIsFocused] = useState(false)
    let [menuHidden, setMenuHidden] = useState(true)
    let selectedItem
    const items = React.Children.map(props.children, child =>
        <div onClick={onMenuItemSelected(child)}>{child}</div>
    )
    if (selectedValue) {
        selectedItem = items.find(item => item['props'].children.props.value === selectedValue)
    } else if (selectedIndex) {
        selectedItem = items[selectedIndex]
    } else {
        selectedItem = props.placeholder
    }
    let selected = selectedItem?.props?.children?.props.children ?? props.placeholder
    let focused = isFocused ? ' focused' : ''
    let isPlaceholder = selected === props.placeholder ? 'placeholder' : ''
    let disabled = isDisabled ? ' disabled' : ''

    return (
        <div className={`Select ${disabled} ${focused} ${className}`}
             style={style}
             onFocus={onFocus(true)}
             onBlur={onFocus(false)}>
            <button onClick={onMenuButtonClick} className={'Selected-item-button ' + isPlaceholder}>
                <div style={selectedContainerStyle}>
                    {selected}
                </div>
            </button>
            <FloatingMenu hidden={menuHidden} onClickOutside={setMenuHidden}>
                {items}
            </FloatingMenu>
        </div>
    )
}

export default Select
