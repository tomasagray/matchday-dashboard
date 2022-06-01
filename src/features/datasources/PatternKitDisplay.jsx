import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {patternKitUpdated, selectPatternKitById} from "./dataSourceSlice";

const EntryRow = (entry) => {
    let groupId = entry[0];
    let fieldName = entry[1];
    return (
        <tr key={groupId}>
            <td>{groupId}</td>
            <td>{fieldName}</td>
        </tr>
    )
}

export const PatternKitDisplay = (props) => {

    const dispatch = useDispatch()

    // event handlers
    const onPatternValChanged = (e) => {
        dispatch(patternKitUpdated({patternKitId: patternKitId, pattern: e.target.value}))
    }

    let {patternKitId} = props
    let patternKit = useSelector(state => selectPatternKitById(state, patternKitId))
    const {fields, pattern} = patternKit
    const patternLen = pattern !== null ? Math.min(pattern.length, 60) : 10
    const patternKitFields = Object.entries(fields).map(entry => EntryRow(entry))

    return (
        <div className="Pattern-kit" key={patternKitId}>
            <table className="Pattern-kit-editor">
                <tbody>
                <tr>
                    <td>
                        <label htmlFor="pattern-kit-pattern">Pattern</label>
                    </td>
                    <td>
                        <input type="text" name="pattern-kit-pattern" value={pattern != null ? pattern : ""} size={patternLen}
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
