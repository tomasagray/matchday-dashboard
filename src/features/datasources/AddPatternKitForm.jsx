import React from "react"
import {
    newPatternKitFieldsUpdated,
    newPatternKitTypeSelected,
    newPatternKitUpdated,
    selectNewPatternKit,
    useGetTemplateForTypeQuery
} from "./patternKitSlice";
import {useDispatch, useSelector} from "react-redux";
import {PatternKitFieldEditor} from "./PatternKitFieldEditor";
import {Spinner} from "../../components/Spinner";
import Select from "../../components/Select";
import {Option} from "../../components/Option";
import {InfoMessage} from "../../components/InfoMessage";

export const AddPatternKitForm = (props) => {

    const patternKitTypeElement = 'pattern-kit-type'

    const dispatch = useDispatch()
    const onSelectType = (e, template) => {
        dispatch(newPatternKitTypeSelected(template))
    }
    const onChangePattern = (value) => {
        dispatch(newPatternKitUpdated({field: 'pattern', value}))
    }
    const onChangeField = (e, fields) => {
        dispatch(newPatternKitFieldsUpdated({field: 'fields', value: fields}))
    }

    let typeIndex
    let typeOptions = []
    let {dataSourceType, dataSourceId} = props
    let newPatternKit = useSelector(state => selectNewPatternKit(state))
    let {type, pattern, fields} = newPatternKit
    let {data: patternKitTemplate, isLoading, isSuccess} = useGetTemplateForTypeQuery(dataSourceType)

    if (isLoading) {
        typeOptions.push(
            <Option value={"loading"} key={255}>
                <Spinner size={16} text={''}/>
            </Option>
        )
        typeIndex = 0
    } else if (isSuccess) {
        let allTemplates = [patternKitTemplate]
        allTemplates.push.apply(allTemplates, patternKitTemplate.relatedTemplates)
        for (let i = 0; i < allTemplates.length; i++) {
            let template = allTemplates[i]
            if (template.type === newPatternKit.type.value) {
                typeIndex = i
            }
            typeOptions.push(
                <Option value={template} key={template.id}>
                    {template.name}
                </Option>
            )
        }
    }

    let editor =
        isLoading ?
            <Spinner/> :
            type.value !== 'placeholder' ?
                <PatternKitFieldEditor type={type.value} pattern={pattern.value} fields={fields.value}
                                       patternHandler={onChangePattern} fieldHandler={onChangeField} /> :
                <InfoMessage>Please select a type from above.</InfoMessage>

    return (
        <form>
            <table className={"data-source-form"}>
                <tbody>
                <tr>
                    <td>
                        <label htmlFor={patternKitTypeElement}>Type</label>
                    </td>
                    <td>
                        <Select name={patternKitTypeElement} placeholder={'Select Pattern Kit type...'}
                                disabled={isLoading} onChange={onSelectType} selectedItem={typeIndex}>
                            {typeOptions}
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <div>
                            {editor}
                        </div>
                        <input type={"hidden"} name={"pattern-kit-dataSourceId"} value={dataSourceId}/>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    )
}
