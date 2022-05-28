import React, {useState} from "react";
import {CollapsableContainer} from "../../components/CollapsableContainer";
import {PatternKitTypeGroup} from "./PatternKitTypeGroup";
import {selectDataSourceById} from "./dataSourceSlice";
import {useSelector} from "react-redux";

const Component = (props) => {

    const DEFAULT_FIELD_SIZE = 25;

    const onBaseUriValChanged = (e) => {
        console.log('baseUri changed', e, baseUriVal)
        setBaseUriVal(e.target.value)
    }
    const onClazzValChanged = (e) => {
        console.log('clazz val changed', e, clazzVal)
        setClazzVal(e.target.value)
    }
    const onAddNewPatternKit = () => {
        console.log('add new pattern kit button clicked')
    }
    const onSaveDataSource = async () => {
        // console.log('saving data source', e, dataSource)
        // await updateDataSource({dataSource})
        console.log("updated")
    }
    const onResetDataSource = () => {
        console.log('resetting...')
        
    }

    let {dataSource} = props
    let {
        dataSourceId,
        patternKitPack,
        baseUri,
        clazz,
    } = dataSource

    let patternKits
    if (patternKitPack) {
        patternKits =
            Object.values(patternKitPack.patternKits)
                .map(patternKitGroup => <PatternKitTypeGroup key={patternKitGroup.id} patternKits={patternKitGroup}/>);
    } else {
        patternKits =
            <p>
                There are currently no Pattern Kits for this Data Source. <br/> Click below to add one.
            </p>
    }
    let [baseUriVal, setBaseUriVal] = useState(baseUri)
    let [clazzVal, setClazzVal] = useState(clazz)

    return (
        <CollapsableContainer _key={dataSourceId} title="TODO: Add title field to data sources">
            <form className="Data-source-field-list">
                <div>
                    <label htmlFor="data-source-base-uri">Base URI:</label>
                    <input type="text" name="data-source-base-uri"
                       value={baseUri} onChange={onBaseUriValChanged}
                       size={baseUri != null ? baseUri.length : DEFAULT_FIELD_SIZE} disabled/>
                </div>
                <div>
                    <label htmlFor="data-source-clazz">Type:</label>
                    <input type="text" name="data-source-clazz"
                        value={clazz} onChange={onClazzValChanged}
                        size={clazz != null ? clazz.length : DEFAULT_FIELD_SIZE} disabled/>
                </div>
                <div>
                    <label>Pattern Kits:</label>
                    <div>{patternKits}</div>
                </div>
            </form>
            <div style={{textAlign: 'right', padding: '2rem'}}>
                <button className="Small-button" onClick={onAddNewPatternKit}>Add Pattern Kit...</button>
            </div>
            <div>
                <button onClick={onResetDataSource} className={"Small-button "}>Reset</button>
                <button onClick={onSaveDataSource} className={"Small-button"}>Save</button>
            </div>
        </CollapsableContainer>
    )
}

export const DataSourceDisplay = (props) => {

    let {dataSourceId} = props
    let dataSource = useSelector(state => {
        if (dataSourceId) {
            return selectDataSourceById(state, dataSourceId)
        }
    })

    if (dataSource) {
        return <Component dataSource={dataSource}/>
    }
}
