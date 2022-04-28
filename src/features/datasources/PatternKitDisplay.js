import React, {useRef, useState} from "react";
import {FloatingMenu} from "../../components/FloatingMenu";
import {MenuItem} from "../../components/MenuItem";
import {useClickOutsideComponent} from "../../hooks/useClickOutsideComponent";

function getEntryRow(entry) {
    return (
        <tr>
            <td>{entry[0]}</td>
            <td>{entry[1]}</td>
        </tr>
    )
}

export const PatternKitDisplay = (props) => {

    const {patternKit} = props
    const {id, fields, pattern} = patternKit;
    const patternLen = pattern !== null ? Math.min(pattern.length, 60) : 10
    const patternKitFields = Object.entries(fields).map(entry => getEntryRow(entry))

    let [patternVal, setPatternVal] = useState(pattern ?? '')
    let [editMenuHidden, setEditMenuHidden] = useState(true)

    // event handlers
    const onPatternValChanged = (e) => {
        console.log('pattern val changed', e, patternVal)
        setPatternVal(e.target.value)
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
        <div className="Pattern-kit" key={id}>
            <table className="Pattern-kit-editor">
                <thead>
                <tr className="Editor-bar">
                    <th>&nbsp;</th>
                    <th ref={menu}>
                        <button onClick={onMenuButtonClick}>&#8942;</button>
                        <FloatingMenu hidden={editMenuHidden}> <MenuItem onClick={onClickEditButton}
                                                                         backgroundColor="green"> Edit <img
                            src={process.env.PUBLIC_URL + '/img/edit-pencil/edit-pencil_32.png'} alt="Edit"/>
                        </MenuItem> <MenuItem onClick={onClickDeleteButton} backgroundColor="darkred"> Delete <img
                            src={process.env.PUBLIC_URL + '/img/delete/delete_32.png'} alt="Delete"/> </MenuItem>
                        </FloatingMenu>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <label htmlFor="pattern-kit-pattern">Pattern</label>
                    </td>
                    <td>
                        <input type="text" name="pattern-kit-pattern" value={patternVal} size={patternLen}
                               onChange={onPatternValChanged}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Fields</label>
                    </td>
                    <td>
                        <table className="Field-list">
                            <thead>
                            <tr>
                                <th>Group</th>
                                <th>Field Name</th>
                            </tr>
                            </thead>
                            <tbody>{patternKitFields}</tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}
