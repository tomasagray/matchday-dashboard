import React, {useState} from 'react'
import {PatternKitDisplay} from "./PatternKitDisplay";

export const PatternKitTypeGroup = (props) => {

    const {
        patternKits
    } = props
    const {clazz} = patternKits;
    const patternKitItems =
        patternKits.patternKits.map(patternKit => <PatternKitDisplay key={patternKit.id} patternKit={patternKit}/>);
    let [clazzVal, setClazzVal] = useState(clazz?? '')
    const onClazzChange = (e) => {
        console.log('clazz changed', e, clazzVal)
        setClazzVal(e.target.value)
    }

    return (
        <>
            <div className="Pattern-kit-display">
                <div>
                    <div className="Pattern-kit-type">
                        <label htmlFor="pattern-kit-clazz">Type</label>
                        <input type="text" name="pattern-kit-clazz"
                           value={clazzVal} size={clazz.length}
                           onChange={onClazzChange} disabled/>
                    </div>
                    <div>{patternKitItems}</div>
                </div>
            </div>
        </>
    )
}
