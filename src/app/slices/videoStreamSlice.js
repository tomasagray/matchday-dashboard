import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";

export const videoStreamAdapter = createEntityAdapter({
    selectId: videoFile => videoFile['videoFileId']
})

const initialState = videoStreamAdapter.getInitialState()

export const videoStreamSlice = createSlice({
    name: 'videoStreams',
    initialState,
    reducers: {
        videoStreamUpdated: videoStreamAdapter.setOne,
    }
})

export default videoStreamSlice.reducer

export const {
    videoStreamUpdated,
} = videoStreamSlice.actions

export const {
    selectById: selectVideoStream,
} = videoStreamAdapter.getSelectors(state => state.videoStreams ?? initialState)

export const selectVideoStreams = createSelector(
    state => state.videoStreams,
    (state, ids) => ids,
    (state, ids) =>
        Object.values(state.entities).filter(stream => ids.includes(stream.videoFileId))
)