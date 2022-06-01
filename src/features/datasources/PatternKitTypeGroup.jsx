import React, {useRef, useState} from 'react'
import {FloatingMenu} from "../../components/FloatingMenu";
import {MenuItem} from "../../components/MenuItem";
import {useClickOutsideComponent} from "../../hooks/useClickOutsideComponent";

export const PatternKitTypeGroup = (props) => {

    let [editMenuHidden, setEditMenuHidden] = useState(true)

    const onMenuButtonClick = (e) => {
        e.preventDefault()
        setEditMenuHidden(false)
    }
    const onClickOutsideMenu = () => {
        setEditMenuHidden(true)
    }
    const onClickEditButton = () => {
        console.log('edit button clicked')
        setEditMenuHidden(true)
    }
    const onClickDeleteButton = () => {
        console.log('delete button clicked')
        setEditMenuHidden(true)
    }

    const menu = useRef(null)
    useClickOutsideComponent(menu, onClickOutsideMenu)

    let type = props.type
    return (
        <div className="Pattern-kit-display" key={type}>
            <div className="Pattern-kit-type">
                <div>
                    <label htmlFor="pattern-kit-clazz">Type</label>
                    <input type="text" name="pattern-kit-clazz" value={type} size={type.length} disabled/>
                </div>
                <div ref={menu}>
                    <button onClick={onMenuButtonClick} className="edit-menu-button">&#8942;</button>
                    <FloatingMenu hidden={editMenuHidden}>
                        <MenuItem onClick={onClickEditButton} backgroundColor="green">
                            <p>Edit</p>
                            <img src={process.env.PUBLIC_URL + '/img/edit-pencil/edit-pencil_32.png'} alt="Edit"/>
                        </MenuItem>
                        <MenuItem onClick={onClickDeleteButton} backgroundColor="darkred">
                            <p>Delete</p>
                            <img src={process.env.PUBLIC_URL + '/img/delete/delete_32.png'} alt="Delete"/>
                        </MenuItem>
                    </FloatingMenu>
                </div>
            </div>
            <div>
                {/* Pattern kit display */}
                {props.children}
            </div>
        </div>
    )
}
