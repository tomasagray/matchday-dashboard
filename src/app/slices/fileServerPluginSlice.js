import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";


const pluginAdapter = createEntityAdapter()

const initialState = pluginAdapter.getInitialState({
    selectedPluginId: null,
})

export const fileServerPluginSlice = createSlice({
    name: 'fileServerPlugins',
    initialState,
    reducers: {
        pluginsLoaded: pluginAdapter.setAll,
        pluginSelected: (state, action) => {
            state.selectedPluginId = action.payload
        }
    }
})

export default fileServerPluginSlice.reducer

export const {
    pluginSelected
} = fileServerPluginSlice.actions

export const selectSelectedPluginId = createSelector(
    state => state.fileServerPlugins,
    state => state['selectedPluginId']
)

export const selectSelectedFileServerPlugin = createSelector(
    state => state.fileServerPlugins,
    plugins => plugins.entities[plugins.selectedPluginId]
)