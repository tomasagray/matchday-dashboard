import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    // selectedPlugin: {
    //     id: 'null',
    //     title: "Not a plugin",
    // },
}

const dataSourcesSlice = createSlice({
    name: 'datasources',
    initialState,
    reducers: {
        pluginSelected(state, action) {
            return {
                ...state,
                selectedPlugin: action.payload.plugin
            }
        }
    }
})

export const {pluginSelected} = dataSourcesSlice.actions

export default dataSourcesSlice.reducer
