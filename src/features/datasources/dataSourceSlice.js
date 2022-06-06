import {dataSourceTag} from "../../app/apiSlice";
import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";

export const dataSourceAdapter = createEntityAdapter({
    selectId: dataSource => dataSource.dataSourceId
})

let initialState = dataSourceAdapter.getInitialState();
export const dataSourceSlice = createSlice({
    name: 'dataSources',
    initialState: {
        clean: initialState,
        dirty: initialState,
    },
    tagTypes: [dataSourceTag],
    reducers: {
        allDataSourcesLoaded(state, action) {
            dataSourceAdapter.setAll(state.clean, action)
            dataSourceAdapter.setAll(state.dirty, action)
        },
        dataSourcesLoaded(state, action) {
            dataSourceAdapter.setMany(state.clean, action)
            dataSourceAdapter.setMany(state.dirty, action)
        },
        dataSourceUpdated(state, action) {
            dataSourceAdapter.updateOne(state.dirty, action)
        },
        dataSourceReset(state, action) {
            let {dataSourceId} = action.payload
            let cleanDataSource =
                Object.values(state.clean.entities).find(dataSource => dataSource.dataSourceId === dataSourceId)
            dataSourceAdapter.setOne(state.dirty, cleanDataSource)
        },
        patternKitUpdated(state, action) {
            // console.log('state in reducer for data sources is', JSON.stringify(state,null,1))
            let {patternKitId, pattern: updatedPattern} = action.payload
            Object.values(state.dirty.entities)
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
    dataSourceReset,
} = dataSourceSlice.actions

export const {
    selectById: selectDataSourceById,
    selectAll: selectAllDataSources
} = dataSourceAdapter.getSelectors((state) => state.dataSources.dirty ?? dataSourceAdapter.getInitialState)

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
            .find(patternKit => patternKit ? patternKit.id === patternKitId : false)
)
