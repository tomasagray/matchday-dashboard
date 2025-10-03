import React from "react";
import {AddButton} from "../../components/controls/AddButton";
import {ColorSelector} from "./ColorSelector";

export const ColorsEditor = (props) => {

    // handlers
    const onClickColorSelect = (color, priority) => onSelectColor && onSelectColor(color, priority)
    const onClickAddColorButton = () => onAddColor && onAddColor()
    const onClickDeleteColor = (priority) => onDeleteColor && onDeleteColor(priority)

    // state
    let {colors, onSelectColor, onAddColor, onDeleteColor} = props

    // components
    return (
        <div className="Colors-editor">
            <ul className="Color-list">
                <li className="Color-selector-container">
                    <span className="Color-priority">
                        <h4>Priority</h4>
                    </span>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        <span style={{marginLeft: '1rem'}}>Color</span>
                        <AddButton onClick={onClickAddColorButton} />
                    </div>
                </li>
                {
                    colors?.length > 0 ?
                        colors?.map((color, priority) =>
                            <ColorSelector
                                key={priority}
                                priority={priority}
                                color={color}
                                onSelectColor={onClickColorSelect}
                                onDeleteColor={onClickDeleteColor}
                            />
                        ) :
                        <p style={{color: '#888', marginTop: '1rem'}}>There are no colors yet.</p>
                }
            </ul>
        </div>
    )
}
