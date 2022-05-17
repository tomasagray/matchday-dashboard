import React, {useState} from "react";
import {CollapsableContainer} from "../../components/CollapsableContainer";
import {PatternKitTypeGroup} from "./PatternKitTypeGroup";
import {useAddDataSourceMutation} from "./dataSourcesSlice";

export const DataSourceDisplay = ({dataSource = null}) => {

    const {
        dataSourceId,
        baseUri,
        clazz,
        patternKitPack
    } = dataSource
    let patternKits
    if (patternKitPack) {
        patternKits =
            Object.values(patternKitPack.patternKits)
                .map(patternKitGroup => <PatternKitTypeGroup key={patternKitGroup.id} patternKits={patternKitGroup}/>);
    } else {
        patternKits =
            <p>
                There are currently no Pattern Kits for this Data Source. <br/>
                Click below to add one.
            </p>
    }
    let [baseUriVal, setBaseUriVal] = useState(baseUri)
    let [clazzVal, setClazzVal] = useState(clazz)

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

    const [updateDataSource, {isLoading}] = useAddDataSourceMutation()

    const onSaveDataSource = async (e) => {
        console.log('saving data source', e, dataSource)
        await updateDataSource({dataSource})
        console.log("updated")
    }

    return (
            <CollapsableContainer _key={dataSourceId} title="TODO: Add title field to data sources">
                <form className="Data-source-field-list">
                    <div>
                        <label htmlFor="data-source-base-uri">Base URI:</label>
                        <input type="text" name="data-source-base-uri"
                               value={baseUri}
                               onChange={onBaseUriValChanged}
                               size={baseUri.length} disabled/>
                    </div>
                    <div>
                        <label htmlFor="data-source-clazz">Type:</label>
                        <input type="text" name="data-source-clazz"
                               value={clazz}
                               onChange={onClazzValChanged}
                               size={clazz.length} disabled/>
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
                    <button onClick={onSaveDataSource} className={"Small-button"}>Save</button>
                </div>
            </CollapsableContainer>
    )
}
