import React, {useState} from "react";
import {TwitterPicker} from "react-color";
import {FloatingMenu} from "../../components/FloatingMenu";
import {ClearButton} from "../../components/controls/ClearButton";

export const ColorSelector = (props) => {

    // handlers
    const onClickColorButton = () => {
        setIsPickerHidden(false)
    }
    const onColorSelected = (color) => {
        setIsPickerHidden(true)
        onSelectColor && onSelectColor(color, priority)
    }
    const onClickDeleteColor = () => {
        onDeleteColor && onDeleteColor(priority)
    }

    // state
    let {color, priority, onSelectColor, onDeleteColor} = props
    let displayColor = color?.hex
    let [isPickerHidden, setIsPickerHidden] = useState(true)

    return (
        <li className="Color-selector-container">
            <span className="Color-priority">{priority}</span>
            <div className="Color-selector">
                <div style={{width: '100%'}}>
                    <button className="Color-selector-button" onClick={onClickColorButton}>
                        <div className="Color-display" style={{backgroundColor: displayColor}}>&nbsp;</div>
                        <span className="Color-name" style={{color: displayColor}}>{displayColor}</span>
                    </button>
                </div>
                <ClearButton onClick={onClickDeleteColor}/>
                <FloatingMenu
                    hidden={isPickerHidden}
                    onClickOutside={setIsPickerHidden}
                    style={{transform: 'translateX(-150%) translateY(50%)'}}
                >
                    <TwitterPicker
                        onChange={onColorSelected}
                        color={color}
                    />
                </FloatingMenu>
            </div>
        </li>
    )
}
