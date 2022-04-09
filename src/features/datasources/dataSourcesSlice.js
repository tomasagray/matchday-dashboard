import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    selectedPlugin: null
}

const dataSourcesSlice = createSlice({
    name: 'datasources',
    initialState: initialState,
    reducers: {
        pluginSelected(state, action) {
            return {
                ...state,
                selectedPlugin: action.payload.plugin
            }
        },
        enableSelectedPlugin(state) {
            state.selectedPlugin.enabled = true
        },
        disableSelectedPlugin(state) {
            state.selectedPlugin.enabled = false
        },
    }
})

export const {pluginSelected, enableSelectedPlugin, disableSelectedPlugin} = dataSourcesSlice.actions

export default dataSourcesSlice.reducer
