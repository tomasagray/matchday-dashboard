import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";

export const videoSourceAdapter = createEntityAdapter()

export const initialState = videoSourceAdapter.getInitialState()


export const videoSourceSlice = createSlice({
    name: 'videoSources',
    initialState,
    reducers: {
        videoSourcesLoaded: videoSourceAdapter.setMany,
        videoSourceLoaded: videoSourceAdapter.setOne,
    }
})

export default videoSourceSlice.reducer

export const {
    videoSourcesLoaded,
    videoSourceLoaded
} = videoSourceSlice.actions
