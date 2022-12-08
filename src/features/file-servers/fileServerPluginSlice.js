import {
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import {pluginAdapter} from "../datasource-plugins/dataSourcePluginSlice";

export const fileServerPluginAdapter = createEntityAdapter()

const initialState = fileServerPluginAdapter.getInitialState({
    selectedPlugin: null,
})

export const {
    selectById: selectFileServerPluginById
} = pluginAdapter.getSelectors(state => state.fileServerPlugins ?? initialState)

export const fileServerPluginSlice = createSlice({
    name: 'fileServerPlugins',
    initialState,
    reducers: {
        pluginsLoaded: pluginAdapter.setAll,
        pluginSelected: (state, action) => {
            state.selectedPlugin = action.payload
        }
    }
})

export default fileServerPluginSlice.reducer

export const {
    pluginSelected
} = fileServerPluginSlice.actions

export const selectSelectedPluginId = createSelector(
    (state) => state.fileServerPlugins,
    (state) => state.selectedPlugin
)
