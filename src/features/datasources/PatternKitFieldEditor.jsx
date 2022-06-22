import React from "react";
import {useGetTemplateForTypeQuery} from "./patternKitSlice";
import {getClassName} from "../../Utils";
import {InfoMessage} from "../../components/InfoMessage";
import {Spinner} from "../../components/Spinner";
import {PatternKitFieldRow} from "./PatternKitFieldRow";

export const PatternKitFieldEditor = (props) => {

    const patternContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 0'
    }

    const onFieldChange = (e, field) => {
        let value
        if (fields) {
            let matching = Object.entries(fields).find(([, value]) => value === field.fieldName)
            if (matching) {
                let [idx] = matching
                fields = {
                    ...fields,
                    [idx]: null,
                }
            }
        }
        value = {
            ...fields,
            [field.value]: field.fieldName
        }
        if (fieldHandler) {
            fieldHandler(e, value)
        }
    }
    const onPatternChange = (e) => {
        if (patternHandler) {
            patternHandler(e.target.value)
        }
    }

    let {pattern, type, fields, patternHandler, fieldHandler} = props
    let patternLen = pattern !== null ? Math.min(pattern.length, 55) : 20
    let typeName = getClassName(type)
    let {data: template, isLoading, isFetching} =
        useGetTemplateForTypeQuery(typeName, {skip: typeName === null})
    let fieldValues = Object.values(fields).filter(field => field !== null)
    let valid = fieldValues.length === template?.fields.length

    let editor
    if (typeName) {
        if (!isLoading && !isFetching) {
            let patternKitFields = template ?
                Object.entries(template.fields)
                    .map(field =>
                        <PatternKitFieldRow pattern={pattern} field={field} fields={fields}
                                            fieldHandler={onFieldChange} key={field[0]}/>
                    ) :
                <tr>
                    <td colSpan={2}>
                        <InfoMessage>Select a type from above</InfoMessage>
                    </td>
                </tr>
            editor = (
                <>
                    <div style={patternContainerStyle}>
                        <h2 style={{paddingRight: '2rem'}}>Pattern</h2>
                        <input type="text" name="pattern-kit-pattern" value={pattern != null ? pattern : ""}
                               size={patternLen} onChange={onPatternChange} placeholder={"Enter a regular expression"}/>
                    </div>
                    <table className="Field-list">
                        <thead>
                        <tr className={"Field-name-heading"}>
                            <th>Field Name</th>
                            <th>Group</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patternKitFields}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={2}>
                                {
                                    valid ? '' :
                                        <p style={{color: 'red', fontWeight: 'bold'}}>
                                            Each field must be assigned to a pattern group
                                        </p>
                                }
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </>
            )
        } else {
            editor = <Spinner size={64} text={'Loading...'}/>
        }
    } else {
        editor = <InfoMessage>Select a type from above</InfoMessage>
    }
    return (
        <> {editor} </>
    )
}
