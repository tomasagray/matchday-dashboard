import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    clearNewDataSource,
    newDataSourceUpdated,
    selectIsNewDataSourceValid,
    selectNewDataSource
} from "../../slices/dataSourceSlice";
import {useGetAllTemplatesQuery} from "../../slices/api/patternKitTemplateApiSlice";
import Select from "../../components/controls/Select";
import {Option} from "../../components/controls/Option";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/controls/CancelButton";
import {SaveButton} from "../../components/controls/SaveButton";
import {useAddDataSourceMutation} from "../../slices/api/dataSourceApiSlice";
import {ToggleGroup, ToggleOption} from "../../components/ToggleGroup";
import {FileUploadButton} from "../../components/controls/FileUploadButton";

export const AddDataSourceForm = (props) => {

    let dispatch = useDispatch()
    // handlers
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
    const onUploadJson = (e) => {
        const field = 'dataSourceJson'
        let file = e.target.files[0]
        let value = {
            name: file.name,
            size: file.size,
            type: file.type,
        }
        dispatch(newDataSourceUpdated({field, value}))
        setJsonData(file)
    }
    const onClearJson = () => {
        dispatch(newDataSourceUpdated({field: 'dataSourceJson', value: {}}))
        setJsonData(new Blob())
    }
    const onSaveNewDataSource = async () => {
        // transform form data into DataSource
        if (jsonData.size > 0) {
            let dataSource = await getJsonFileData()
            console.log('saving:', JSON.stringify(dataSource))
            await addDataSource(dataSource)
        } else {
            let dataSource = getFormData()
            console.log('saving:', dataSource)
            await addDataSource(dataSource)
        }
        dispatch(clearNewDataSource({}))
        onHide && onHide()
    }
    const getJsonFileData = async () => {
        return readJsonFileData().then(content => {
            return content
        })
    }
    const readJsonFileData = () => {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onload = e => resolve(e.target.result)
            reader.onerror = e => reject(e)
            reader.readAsText(jsonData)
        })
    }
    const getFormData = () => {
        return {
            dataSourceId: null,
            clazz: newDataSource.type.value,
            title: newDataSource.title.value,
            baseUri: newDataSource.baseUri.value,
            pluginId: pluginId,
            patternKits: [],
        }
    }

    // hooks
    let [addDataSource, {
        isLoading: isDataSourceSaving,
        isSuccess: isDataSourceSaveSuccess,
        isError: isSaveDataSourceError,
        error: saveDataSourceError
    }] = useAddDataSourceMutation()
    let {
        data: templates,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAllTemplatesQuery()

    // toast messages
    useEffect(() => {
        if (isSaveDataSourceError) {
            let msg = 'Could not save data source: ' + getToastMessage(saveDataSourceError)
            toast.error(msg);
        }
        if (isDataSourceSaveSuccess) {
            toast('DataSource was successfully uploaded')
        }
        if (isError) {
            let msg = 'Failed to add data source: ' + getToastMessage(error)
            toast.error(msg)
        }
    }, [error, isError, isSuccess,
        isSaveDataSourceError,
        saveDataSourceError,
        isDataSourceSaveSuccess])

    // state
    let {pluginId, isShown, onHide} = props
    let newDataSource = useSelector(state => selectNewDataSource(state))
    let {type, title, baseUri, dataSourceJson} = newDataSource
    let isFormValid = useSelector(state => selectIsNewDataSourceValid(state))
    let [jsonData, setJsonData] = useState(new Blob())
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

    // components
    let disabled = isLoading || isDataSourceSaving
    return (
        <>
            <Modal show={isShown}>
                <Header onHide={onHide}>Add New Data Source</Header>
                <Body>
                    <div className="Add-datasource-container">
                        <div className="Add-datasource-header">

                        </div>
                    </div>
                    <form>
                        <ToggleGroup>
                            <ToggleOption title={'Create'}>
                                <table className={"Add-data-source-form"}>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <h3>Type</h3>
                                        </td>
                                        <td>
                                            <Select disabled={disabled}
                                                    placeholder={'Select Data Source type...'}
                                                    onChange={onSelectType} selectedValue={selectedValue}>
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
                            </ToggleOption>
                            <ToggleOption title={'Upload'}>
                                <p style={{marginBottom: '1rem'}}>
                                    Upload DataSource JSON
                                </p>
                                <FileUploadButton
                                    accept={'.json'}
                                    value={dataSourceJson.value?.name}
                                    onChange={onUploadJson}
                                    onClear={onClearJson}
                                />
                            </ToggleOption>
                        </ToggleGroup>
                    </form>
                </Body>
                <Footer>
                    <CancelButton onClick={onHide} disabled={isDataSourceSaving}>
                        Discard
                    </CancelButton>
                    <SaveButton
                        onClick={onSaveNewDataSource}
                        disabled={!isFormValid || isDataSourceSaving}
                        isLoading={isDataSourceSaving}
                    />
                </Footer>
            </Modal>
        </>
    )
}
