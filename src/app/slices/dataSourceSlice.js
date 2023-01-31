import {dataSourceTag} from "./api/apiSlice";
import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";

export const dataSourceAdapter = createEntityAdapter({
    selectId: dataSource => dataSource.dataSourceId
})

let initialState = dataSourceAdapter.getInitialState()
const initialNewDataSource = {
    type: {
        value: 'placeholder',
        valid: false,
    },
    title: {
        value: "",
        valid: false,
    },
    baseUri: {
        value: "",
        valid: false,
    },
    dataSourceJson: {
        value: null,
        valid: false,
    }
}

const isFieldValid = (payload) => {
    switch (payload.field) {
        case 'type':
            return payload.value !== 'placeholder'
        case 'title':
            return payload.value !== '' && payload.value.length < 256
        case 'baseUri':
            return payload.value !== '' && /https?:\/\/\w+/.test(payload.value)
        case 'dataSourceJson':
            return payload.value !== null
        default:
            return false
    }
}

export const dataSourceSlice = createSlice({
    name: 'dataSources',
    initialState: {
        clean: initialState,
        dirty: initialState,
        newDataSource: initialNewDataSource,
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
        newDataSourceUpdated(state, action) {
            let payload = action.payload
            state.newDataSource = {
                ...state.newDataSource,
                [payload.field]: {
                    value: payload.value,
                    valid: isFieldValid(payload),
                }
            }
        },
        clearNewDataSource(state) {
            state.newDataSource = initialNewDataSource
        },
        patternKitUpdated(state, action) {
            let {patternKitId, data} = action.payload
            let {field, value} = data
            let dataSource = Object.values(state.dirty.entities)
                .find(dataSource =>
                    dataSource.patternKits.find(patternKit => patternKit.id === patternKitId)
                )
            dataSource = {
                ...dataSource,
                patternKits:
                    dataSource.patternKits
                        .map(patternKit =>
                            patternKit.id === patternKitId ?
                                {...patternKit, [field]: value} :
                                patternKit)
            }
            dataSourceAdapter.setOne(state.dirty, dataSource)
        },
        patternKitDeleted(state, action) {
            let {patternKitId} = action.payload
            let dataSource =
                Object.values(state.dirty.entities)
                    .find(dataSource =>
                        dataSource.patternKits.find(patternKit => patternKit.id === patternKitId))
            dataSource = {
                ...dataSource,
                patternKits: dataSource.patternKits.filter(patternKit => patternKit.id !== patternKitId)
            }
            dataSourceAdapter.setOne(state.dirty, dataSource)
        },
    }
})
export default dataSourceSlice.reducer
export const {
    allDataSourcesLoaded,
    dataSourcesLoaded,
    dataSourceUpdated,
    dataSourceReset,
    newDataSourceUpdated,
    clearNewDataSource,
    patternKitUpdated,
    patternKitDeleted,
} = dataSourceSlice.actions

export const {
    selectById: selectDataSourceById,
    selectAll: selectAllDataSources
} = dataSourceAdapter.getSelectors((state) => state.dataSources.dirty ?? dataSourceAdapter.getInitialState)

export const selectCleanDataSourceById = createSelector(
    (state) => state.dataSources,
    (state, dataSourceId) => dataSourceId,
    (state, dataSourceId) =>
        Object.values(state.clean.entities).find(dataSource => dataSource.dataSourceId === dataSourceId)
)

export const selectNewDataSource = createSelector(
    (state) => state.dataSources,
    (state) => state.newDataSource
)

export const selectIsNewDataSourceValid = createSelector(
    selectNewDataSource,
    newDataSource => {
        return newDataSource.dataSourceJson.valid ||
            (
                newDataSource.type.valid &&
                newDataSource.title.valid &&
                newDataSource.baseUri.valid
            )
    }
)

export const selectPatternKitById = createSelector(
    selectAllDataSources,
    (state, patternKitId) => patternKitId,
    (dataSources, patternKitId) =>
        dataSources
            .flatMap(dataSource => dataSource.patternKits)
            .find(patternKit => patternKit ? patternKit.id === patternKitId : false)
)
