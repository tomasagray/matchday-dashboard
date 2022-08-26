import React, {useRef} from "react";
import {TwitterPicker} from "react-color";

export const ColorTile = (props) => {

    // handlers
    const onColorSelect = (color) => {
        console.log('color changed', color)
        onChange && onChange()
    }

    const {onChange, color} = props

    // hooks
    let colorDisplayRef = useRef(null)

    return (
        <>
            <div className="Color-tile">
                <div className="Color-display" ref={colorDisplayRef}></div>
                <p className="Color-code">{color}</p>
                <TwitterPicker
                    color={color}
                    onChangeComplete={onColorSelect}
                />
            </div>
        </>
    )
}
