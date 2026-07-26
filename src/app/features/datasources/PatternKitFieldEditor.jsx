import React from "react";
import {getClassName} from "../../utils";
import {InfoMessage} from "../../components/InfoMessage";
import {Spinner} from "../../components/Spinner";
import {PatternKitFieldRow} from "./PatternKitFieldRow";
import {useGetTemplateForTypeQuery} from "../../slices/api/patternKitTemplateApiSlice";

export const validateFields = (fields, template) => {
    if (!fields || !template) {
        return false
    }
    const fieldValues = Object.values(fields)
    return template.fields
        .filter(field => field.required)
        .map(field => fieldValues.find(value => value === field.fieldName) !== undefined)
        .reduce((isValid, isFieldValid) => isValid && isFieldValid)
}

export const PatternKitFieldEditor = (props) => {

    const patternContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        padding: '3rem 0.3rem',
    }
    const helpMessage =
        <div style={{display: 'flex', justifyContent: 'center', padding: '2rem'}}>
            <InfoMessage>Select a type from above</InfoMessage>
        </div>

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

    let {pattern, type, fields, patternHandler, fieldHandler, disabled} = props
    let patternLen = pattern !== null ? pattern.length : 20
    let typeName = getClassName(type)
    let {data: template, isLoading, isFetching} =
        useGetTemplateForTypeQuery(typeName, {skip: typeName === null})
    let isValid = validateFields(fields, template)
    let editor

    if (typeName) {
        if (!isLoading && !isFetching) {
            let patternKitFields = template ?
                Object.entries(template.fields)
                    .map(field =>
                        <PatternKitFieldRow pattern={pattern} field={field} fields={fields} disabled={disabled}
                                            fieldHandler={onFieldChange} key={field[0]}/>
                    ) :
                <tr>
                    <td colSpan={2}>
                        {helpMessage}
                    </td>
                </tr>
            editor = (
                <>
                    <div style={patternContainerStyle}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '.5rem'}}>
                            <img alt="Pattern (regex)" src="/img/icon/pattern/pattern_64.png"
                                 style={{marginRight: '.5rem'}}
                                 width={20} height={20}
                            />
                            <h3 style={{color: '#ccc'}}>Pattern</h3>
                        </div>
                        <input type="text" name="pattern-kit-pattern" className="Pattern-kit-pattern"
                               value={pattern != null ? pattern : ""} disabled={disabled} size={patternLen}
                               onChange={onPatternChange} placeholder={"Enter a regular expression"}/>
                    </div>
                    <table className="Field-list">
                        <thead>
                        <tr className={"Field-name-heading"}>
                            <th><span>Field Name</span></th>
                            <th><span>Group</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        {patternKitFields}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={2}>
                                {
                                    isValid || disabled ? '' :
                                        <p style={{color: 'red', fontWeight: 'bold'}}>
                                            Please ensure each required field has been assigned a value.</p>
                                }
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </>
            )
        } else {
            editor =
                <div style={{padding: '2rem'}}>
                    <Spinner size={'32px'} text={''}/>
                </div>
        }
    } else {
        editor = helpMessage
    }
    return (
        <> {editor} </>
    )
}
