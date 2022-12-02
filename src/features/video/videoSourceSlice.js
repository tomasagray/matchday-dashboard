import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {createEnum} from "../../app/utils";

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
        videoFileStatusUpdated: (state, action) => {
            let {payload} = action
            let {status} = payload
            Object.values(state.entities)
                .forEach(videoSource => {
                    let statuses = []
                    let videoFiles = Object.values(videoSource['videoFiles'])
                    videoFiles
                        .forEach(videoFile => {
                            if (videoFile['videoFileId'] === status['videoFileId']) {
                                videoFile.status = status
                            }
                            if (videoFile.status) {
                                statuses.push(videoFile.status)
                            }
                        })
                    if (statuses.length > 0) {
                        // status of VideoFileSource is that of lowest-status VideoFile
                        videoSource.status = statuses.reduce((status, videoStatus) =>
                            JobStatus[videoStatus.status] < JobStatus[status.status] ?
                                videoStatus.status : status.status)
                    }
                    // get avg completion ratio
                    videoSource.completionRatio = videoFiles.reduce((overall, videoFile) => {
                        let status = videoFile.status
                        let completionRatio = status ? status.completionRatio : 0
                        return overall + completionRatio
                    }, 0) / videoFiles.length
                })
        }
    }
})

export default videoSourceSlice.reducer

export const {
    videoSourcesLoaded,
    videoFileStatusUpdated,
} = videoSourceSlice.actions

export const {
    selectAll: selectAllVideoSources,
    selectById: selectVideoSourceById,
} = videoSourceAdapter.getSelectors(state => state.videoSources ?? initialState)
