import React from "react";
import {CollapsableContainer} from "../../components/CollapsableContainer";
import {PatternKitTypeGroup} from "./PatternKitTypeGroup";
import {dataSourceUpdated, selectDataSourceById} from "./dataSourceSlice";
import {useDispatch, useSelector} from "react-redux";
import {getClassName} from "../../Utils";
import {InfoMessage} from "../../components/InfoMessage";
import {PatternKitDisplay} from "./PatternKitDisplay";


export const DataSourceDisplay = (props) => {

    const DEFAULT_FIELD_SIZE = 25

    const dispatch = useDispatch()
    const onBaseUriValChanged = (e) => {
        let baseUriVal = e.target.value
        let updatedDataSource = {
            ...dataSource,
            baseUri: baseUriVal
        }
        dispatch(dataSourceUpdated({id: dataSourceId, changes: updatedDataSource}))
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

    let {dataSourceId} = props
    let dataSource = useSelector(state => {
        if (dataSourceId) {
            return selectDataSourceById(state, dataSourceId)
        }
    })

    if (dataSource) {
        let {
            patternKits,
            baseUri,
            clazz,
        } = dataSource

        let patternKitsDisplay
        if (patternKits) {
            let groupedPatternKits = patternKits.reduce((reducer, patternKit) => {
                // todo - make this an object instead of array
                reducer[patternKit.clazz] = reducer[patternKit.clazz] || []
                reducer[patternKit.clazz].push(patternKit)
                return reducer
            }, Object.create(null))
            patternKitsDisplay = Object.entries(groupedPatternKits).map(( patternKitGroup) => {
                let fqName = patternKitGroup[0];
                let type = getClassName(fqName)
                let patternKits = patternKitGroup[1];
                return (
                    <PatternKitTypeGroup key={type} type={type}>
                        {
                            patternKits.map(patternKit => <PatternKitDisplay key={patternKit.id} patternKitId={patternKit.id} />)
                        }
                    </PatternKitTypeGroup>
                )
            })
        } else {
            patternKitsDisplay =
                <InfoMessage>
                    There are currently no Pattern Kits for this Data Source. <br/> Click below to add one.
                </InfoMessage>
        }

        let type = getClassName(clazz)
        return (
            <CollapsableContainer _key={dataSourceId} title="TODO: Add title field to data sources">
                <form className="Data-source-field-list">
                    <div>
                        <label htmlFor="data-source-clazz">Type:</label>
                        <input type="text" name="data-source-clazz" value={type}
                               size={type != null ? type.length : DEFAULT_FIELD_SIZE} disabled />
                    </div>
                    <div>
                        <label htmlFor="data-source-base-uri">Base URI:</label>
                        <input type="text" name="data-source-base-uri"
                               value={baseUri} onChange={onBaseUriValChanged}
                               size={baseUri != null ? baseUri.length : DEFAULT_FIELD_SIZE} />
                    </div>
                    <div>
                        <label>Pattern Kits:</label>
                        <div style={{padding: '1rem'}}>
                            {patternKitsDisplay}
                        </div>
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
}
