import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {dataSourcePluginTag} from "./api/apiSlice";


const pluginAdapter = createEntityAdapter()
const initialState = pluginAdapter.getInitialState({
    selectedPluginId: null,
})

export const dataSourcePluginSlice = createSlice({
    name: 'dataSourcePlugins',
    initialState,
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

export const selectSelectedPlugin = createSelector(
    state => state.dataSourcePlugins,
    plugins => {
        const pluginId = plugins.selectedPluginId
        return plugins.entities[pluginId]
    }
)