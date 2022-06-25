import React, {useState} from "react";
import {FloatingMenu} from "./FloatingMenu";

export const Select = (props) => {

    let {disabled: isDisabled, selectedIndex} = props
    let [isFocused, setIsFocused] = useState(false)
    let [menuHidden, setMenuHidden] = useState(true)

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
        if (props.onChange) {
            props.onChange(e, option.props.value)
        }
    }

    let selectedItem
    let childCount = React.Children.count(props.children)
    const items = React.Children.map(props.children, child =>
        <div onClick={onMenuItemSelected(child)}>{child}</div>
    )
    if (childCount === 0 || selectedIndex === null) {
        selectedItem = props.placeholder
    } else {
        selectedItem = items[selectedIndex]
    }

    const menuStyle = {
        transform: 'translate(-4px, 2px)',
        zIndex: 100,
        width: '10.3rem',
    }
    const selectedContainerStyle = {
        maxWidth: '90%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipses',
    }

    let selected = selectedItem?.props?.children?.props.children ?? props.placeholder
    let focused = isFocused ? ' focused' : ''
    let isPlaceholder = selected === props.placeholder ? 'placeholder' : ''
    let disabled = isDisabled ? ' disabled' : ''
    return (
        <div className={'Select' + disabled + focused} onFocus={onFocus(true)} onBlur={onFocus(false)}>
            <button onClick={onMenuButtonClick} className={'Selected-item-button ' + isPlaceholder}>
                <div style={selectedContainerStyle}>
                    {selected}
                </div>
            </button>
            <FloatingMenu hidden={menuHidden} onClickOutside={setMenuHidden} style={menuStyle}>
                {items}
            </FloatingMenu>
        </div>
    )
}

export default Select
