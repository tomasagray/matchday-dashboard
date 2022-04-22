import React, {useState} from "react";
import {CollapsableContainer} from "../../components/CollapsableContainer";
import {PatternKitTypeGroup} from "./PatternKitTypeGroup";

export const DataSourceDisplay = ({datasource = null}) => {

    const {
        baseUri,
        clazz,
        patternKitPack
    } = datasource
    let patternKits
    if (patternKitPack) {
        patternKits =
            Object.values(patternKitPack.patternKits)
                .map(patternKitGroup => <PatternKitTypeGroup patternKits={patternKitGroup} />);
    } else {
        patternKits = <p>No PatternKitPack</p>
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

     return (
        <>
            <CollapsableContainer title="TODO: Add title field to data sources">
                <form className="Data-source-field-list">
                    <div>
                        <label htmlFor="data-source-base-uri">Base URI:</label>
                        <input type="text" name="data-source-base-uri" value={baseUri}
                               onChange={onBaseUriValChanged} size={baseUri.length} disabled />
                    </div>
                    <div>
                        <label htmlFor="data-source-clazz">Type:</label>
                        <input type="text" name="data-source-clazz" value={clazz}
                               onChange={onClazzValChanged} size={clazz.length} disabled />
                    </div>
                    <div>
                        <label>Pattern Kits:</label>
                        <div>{patternKits}</div>
                    </div>
                </form>
            </CollapsableContainer>
        </>
    )
}
