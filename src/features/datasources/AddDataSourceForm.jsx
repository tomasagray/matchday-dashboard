import React from "react";
import {useGetAllTemplatesQuery} from "./patternKitSlice";
import {useDispatch, useSelector} from "react-redux";
import {newDataSourceUpdated, selectNewDataSource} from "./dataSourceSlice";

export const AddDataSourceForm = (props) => {

    const dataSourceTypeElement = "data-source-type"
    const dataSourceTitleElement = "data-source-title"
    const dataSourceBaseUriElement = "data-source-base-uri"

    let dispatch = useDispatch()
    const onSelectType = (e) => {
        let value = e.target.value
        dispatch(newDataSourceUpdated({field: 'type', value}))
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
    let {data: templates, isLoading} = useGetAllTemplatesQuery()
    let templateOptions =
        templates?.map(template => <option value={template.type} key={template.id}>{template.name}</option> ) ?? []
    let newDataSource = useSelector( state =>  selectNewDataSource(state))
    let {type, title, baseUri} = newDataSource

    return (
        <form>
            <table className={"data-source-form"}>
                <tbody>
                <tr>
                    <td>
                        <label htmlFor={dataSourceTypeElement}>Type</label>
                    </td>
                    <td>
                        <select name={dataSourceTypeElement} disabled={isLoading || disabled}
                                onChange={onSelectType} value={type.value} >
                            <option value="placeholder" disabled hidden>Select Data Source type...</option>
                            {templateOptions}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor={dataSourceTitleElement}>Title</label>
                    </td>
                    <td>
                        <input type="text" name={dataSourceTitleElement} value={title.value} maxLength={255}
                               onChange={onChangeDataSourceTitle} placeholder={"Enter a title..."}
                               disabled={disabled}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor={dataSourceBaseUriElement}>Base URI</label>
                    </td>
                    <td>
                        <input type={"url"} placeholder={"https://..."} name={dataSourceBaseUriElement}
                               value={baseUri.value} onChange={onChangeDataSourceBaseUri}
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
