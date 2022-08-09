import React from "react"
import {
    newPatternKitFieldsUpdated,
    newPatternKitTypeSelected,
    newPatternKitUpdated,
    selectNewPatternKit,
} from "./patternKitSlice";
import {useDispatch, useSelector} from "react-redux";
import {PatternKitFieldEditor, validateFields} from "./PatternKitFieldEditor";
import {Spinner} from "../../components/Spinner";
import Select from "../../components/controls/Select";
import {Option} from "../../components/controls/Option";
import {InfoMessage} from "../../components/InfoMessage";
import {useGetTemplateForTypeQuery} from "./patternKitTemplateApiSlice";

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
        let valid = validateFields(fields, type.value)
        dispatch(newPatternKitFieldsUpdated({fields, valid}))
    }

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
    } else if (isSuccess) {
        let allTemplates = [patternKitTemplate]
        allTemplates.push.apply(allTemplates, patternKitTemplate['relatedTemplates'])
        for (let i = 0; i < allTemplates.length; i++) {
            let template = allTemplates[i]
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
                <PatternKitFieldEditor type={type.value?.type} pattern={pattern.value} fields={fields.value}
                                       patternHandler={onChangePattern} fieldHandler={onChangeField} /> :
                <div style={{padding: '2rem'}}>
                    <InfoMessage>Please select a type from above.</InfoMessage>
                </div>

    return (
        <form>
            <div className={"Add-pattern-kit-form"}>
                <div style={{display: 'flex'}}>
                    <h3 style={{paddingRight: '5.25rem'}}>Type</h3>
                    <Select name={patternKitTypeElement} placeholder={'Select Pattern Kit type...'}
                            selectedValue={type.value} disabled={isLoading}
                            onChange={onSelectType}>
                        {typeOptions}
                    </Select>
                </div>
                <div>
                    {editor}
                </div>
            </div>
            <input type={"hidden"} name={"pattern-kit-dataSourceId"} value={dataSourceId}/>
        </form>
    )
}
