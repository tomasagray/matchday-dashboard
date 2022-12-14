import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {createEnum} from "../utils";

export const videoSourceAdapter = createEntityAdapter()

export const initialState = videoSourceAdapter.getInitialState()

export const JobStatus = createEnum([
    'ERROR',
    'STOPPED',
    'CREATED',
    'QUEUED',
    'STARTED',
    'BUFFERING',
    'STREAMING',
    'COMPLETED',
])

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
} = videoSourceSlice.actions

export const {
    selectById: selectVideoSourceById,
} = videoSourceAdapter.getSelectors(state => state.videoSources ?? initialState)
