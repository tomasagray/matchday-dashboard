import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {dataSourcePluginTag} from "../../app/apiSlice";
import {selectPluginsData} from "./dataSourcePluginApiSlice";

export const pluginAdapter = createEntityAdapter()

const initialState = pluginAdapter.getInitialState({
    selectedPluginId: null,
})

export const {
    selectAll: selectAllDataSourcePlugins,
    selectById: selectDataSourcePluginById
} = pluginAdapter.getSelectors(state => {
    console.log('comeplete state', state)
    return state.dataSourcePlugins ?? initialState
})

export const dataSourcePluginSlice = createSlice({
    name: 'dataSourcePlugins',
    initialState: initialState,
    tagTypes: [dataSourcePluginTag],
    reducers: {
        pluginsLoaded: pluginAdapter.setAll,
        pluginSelected(state, action) {
            state.selectedPluginId = action.payload
        },
    }
})

export default dataSourcePluginSlice.reducer
export const {
    pluginSelected,
} = dataSourcePluginSlice.actions
