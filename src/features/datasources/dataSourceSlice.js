import {dataSourceTag} from "../../app/apiSlice";
import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";

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
    }
})
export default dataSourceSlice.reducer

export const {
    selectById: selectDataSourceById,
    selectAll: selectAllDataSources
} = dataSourceAdapter.getSelectors((state) => state.dataSources ?? dataSourceAdapter.getInitialState)
