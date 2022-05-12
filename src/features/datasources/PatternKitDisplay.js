import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {patternKitUpdated} from "./dataSourcesSlice";

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
    const dispatch = useDispatch()

    // event handlers
    const onPatternValChanged = (e) => {
        console.log('pattern kit id', id)
        console.log('pattern val changed', e.target.value)
        console.log('patternKit:', patternKit)
        setPatternVal(e.target.value)
        dispatch(patternKitUpdated({id: id, pattern: e.target.value}))
    }

    return (
        <div className="Pattern-kit" key={id}>
            <table className="Pattern-kit-editor">
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
    );
}
