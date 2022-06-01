import {dataSourceTag} from "../../app/apiSlice";
import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";

export const dataSourceAdapter = createEntityAdapter({
    selectId: dataSource => dataSource.dataSourceId
})

export const dataSourceSlice = createSlice({
    name: 'dataSources',
    initialState: dataSourceAdapter.getInitialState(),
    tagTypes: [dataSourceTag],
    reducers: {
        allDataSourcesLoaded: dataSourceAdapter.setAll,
        dataSourcesLoaded: dataSourceAdapter.setMany,
        dataSourceUpdated: dataSourceAdapter.updateOne,
        patternKitUpdated(state, action) {
            // console.log('state in reducer for data sources is', JSON.stringify(state,null,1))
            let {patternKitId, pattern: updatedPattern} = action.payload
            Object.values(state.entities)
                .flatMap(dataSource => dataSource.patternKits)
                .forEach(patternKit => {
                    if (patternKit.id === patternKitId) {
                        patternKit.pattern = updatedPattern
                    }
                })
        },
    }
})
export default dataSourceSlice.reducer
export const {
    allDataSourcesLoaded,
    dataSourcesLoaded,
    dataSourceUpdated,
    patternKitUpdated,
} = dataSourceSlice.actions

export const {
    selectById: selectDataSourceById,
    selectAll: selectAllDataSources
} = dataSourceAdapter.getSelectors((state) => state.dataSources ?? dataSourceAdapter.getInitialState)

export const selectDataSourceBaseUri = createSelector(
    (state, dataSourceId) => dataSourceId,
    selectDataSourceById,
    (dataSourceId, dataSource) => dataSource.baseUri
)

export const selectPatternKitById = createSelector(
    selectAllDataSources,
    (state, patternKitId) => patternKitId,
    (dataSources, patternKitId) =>
        dataSources
            .flatMap(dataSource => dataSource.patternKits)
            .find(patternKit => patternKit.id === patternKitId)
)
