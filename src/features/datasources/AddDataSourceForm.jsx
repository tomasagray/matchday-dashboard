import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {newDataSourceUpdated, selectNewDataSource} from "./dataSourceSlice";
import {useGetAllTemplatesQuery} from "./patternKitTemplateApiSlice";
import Select from "../../components/controls/Select";
import {Option} from "../../components/controls/Option";

export const AddDataSourceForm = (props) => {

    let dispatch = useDispatch()
    const onSelectType = (e, type) => {
        dispatch(newDataSourceUpdated({field: 'type', value: type}))
    }
    const onChangeDataSourceTitle = (e) => {
        let value = e.target.value
        dispatch(newDataSourceUpdated({field: 'title', value}))
    }
    const onChangeDataSourceBaseUri = (e) => {
        let value = e.target.value
        dispatch(newDataSourceUpdated({field: 'baseUri', value}))
    }

    let {pluginId, disabled} = props
    let newDataSource = useSelector( state =>  selectNewDataSource(state))
    let {type, title, baseUri} = newDataSource
    let {data: templates, isLoading} = useGetAllTemplatesQuery()
    let selectedValue
    let templateOptions = []
    for (let i = 0; i < templates?.length ?? 0; i++) {
        let template = templates[i]
        if (template.type === type.value) {
            selectedValue = template.type
        }
        templateOptions.push(
            <Option value={template.type} key={template.id}>{template.name}</Option>
        )
    }

    return (
        <form>
            <table className={"Add-data-source-form"}>
                <tbody>
                <tr>
                    <td>
                        <h3>Type</h3>
                    </td>
                    <td>
                        <Select disabled={isLoading || disabled} placeholder={'Select Data Source type...'}
                                onChange={onSelectType} selectedValue={selectedValue} >
                            {templateOptions}
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>Title</h3>
                    </td>
                    <td>
                        <input type="text" value={title.value} maxLength={255}
                               onChange={onChangeDataSourceTitle} placeholder={"Enter a title..."}
                               disabled={disabled}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>Base URI</h3>
                    </td>
                    <td>
                        <input type={"url"} placeholder={"https://..."} value={baseUri.value}
                               onChange={onChangeDataSourceBaseUri}
                               disabled={disabled}
                        />
                        <input type={"hidden"} name={"data-source-pluginId"} value={pluginId}/>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    );
}
