import React, {useRef, useState} from 'react'
import {PatternKitDisplay} from "./PatternKitDisplay";
import {FloatingMenu} from "../../components/FloatingMenu";
import {MenuItem} from "../../components/MenuItem";
import {useClickOutsideComponent} from "../../hooks/useClickOutsideComponent";

export const PatternKitTypeGroup = (props) => {

    const {patternKits} = props
    const {clazz} = patternKits;
    const patternKitItems =
        patternKits.patternKits.map(patternKit => <PatternKitDisplay key={patternKit.id} patternKit={patternKit}/>);

    let [clazzVal, setClazzVal] = useState(clazz?? '')
    let [editMenuHidden, setEditMenuHidden] = useState(true)

    const onClazzChange = (e) => {
        console.log('clazz changed', e, clazzVal)
        setClazzVal(e.target.value)
    }
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

    return (
        <>
            <div className="Pattern-kit-display">
                <div className="Pattern-kit-type">
                    <div>
                        <label htmlFor="pattern-kit-clazz">Type</label>
                        <input type="text" name="pattern-kit-clazz"
                               value={clazzVal} size={clazz.length}
                               onChange={onClazzChange} disabled/>
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
                <div>{patternKitItems}</div>
            </div>
        </>
    )
}
