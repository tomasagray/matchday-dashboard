import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {createEnum, isValidUrl} from "../utils";
import {v4 as uuidv4} from "uuid";


// enums
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

export const Resolution = createEnum([
    '4K',
    '1080p',
    '1080i',
    '720p',
    '576p',
    'SD'
])

export const PartIdentifier = createEnum([
    'Pre-Match',
    '1st Half',
    '2nd Half',
    'Extra-Time/Penalties',
    'Trophy Ceremony',
    'Post-Match',
    'Full Coverage'
])

const uploadPartIdentifier = {
    'Pre-Match': 'PRE_MATCH',
    '1st Half': 'FIRST_HALF',
    '2nd Half': 'SECOND_HALF',
    'Extra-Time/Penalties': 'EXTRA_TIME',
    'Trophy Ceremony': 'TROPHY_CEREMONY',
    'Post-Match': 'POST_MATCH',
    'Full Coverage': 'FULL_COVERAGE',
}

// helper methods
const removeVideoFile = (edited, videoFile) => {
    return edited.videoFiles.filter(file => file.videoFileId.value !== videoFile.videoFileId.value)
}

const validateField = (value) => {
    if (!isNaN(value)) {    // is a number
        return value > 0
    }
    return value !== ''
}

const validateVideoFile = (videoFile) => {
    return isValidUrl(videoFile.externalUrl.value) && videoFile.title.value !== ''
}

const getObjectForUpload = (o) => {
    let obj = {}
    Object.entries(o).forEach(entry => {
        if (entry[0] === 'title') {
            obj['title'] = entry[1].value
        } else if (entry[0] === 'videoFiles') {
            let videoFiles = {}
            entry[1].forEach(videoFile => {
                videoFiles = {
                    ...videoFiles,
                    [uploadPartIdentifier[videoFile.title.value]]: getObjectForUpload(videoFile)
                }
            })
            obj['videoFiles'] = videoFiles
        } else {
            Array.isArray(entry[1]) ?
                obj[entry[0]] = entry[1].map(e => getObjectForUpload(e)) :
                obj[entry[0]] = entry[1].value
        }
    })
    return obj
}

const getObjectForEditing = (o) => {
    let obj = {}
    Object.entries(o).forEach(entry => {
        return entry[1] === null ?
            obj[entry[0]] = {
                value: '',
                valid: false,
            } :
            Array.isArray(entry[1]) ?
                obj[entry[0]] = entry[1].map(e => getObjectForEditing(e)) :
                typeof entry[1] === 'object' ?
                    obj[entry[0]] = Object.values(entry[1]).map(e => getObjectForEditing(e)) :
                    obj[entry[0]] = {
                        value: entry[1],
                        valid: validateField(entry[1]),
                    }
    })
    return obj
}

// initial data
const getInitialVideoFile = () => {
    return {
        videoFileId: {
            value: uuidv4(),
            valid: true,
        },
        externalUrl: {
            value: '',
            valid: true,
        },
        title: {
            value: '',
            valid: true,
        },
    }
}

const getInitialVideoSource = () => {
    return {
        id: {
            value: uuidv4(),
            valid: true,
        },
        channel: {
            value: '',
            valid: true,
        },
        resolution: {
            value: '',
            valid: true,
        },
        source: {
            value: 'DVB-S2',
            valid: true,
        },
        approximateDuration: {
            value: '90min',
            valid: true,
        },
        languages: {
            value: '',
            valid: true,
        },
        mediaContainer: {
            value: '',
            valid: true,
        },
        bitrate: {
            value: 8,
            valid: true,
        },
        frameRate: {
            value: 0,
            valid: true,
        },
        videoCodec: {
            value: 'H.264',
            valid: true,
        },
        videoBitrate: {
            value: 8,
            valid: true,
        },
        audioCodec: {
            value: 'AC3',
            valid: true,
        },
        audioBitrate: {
            value: 0,
            valid: true,
        },
        audioChannels: {
            value: '',
            valid: true,
        },
        filesize: {
            value: 0,
            valid: true,
        },
        videoFiles: [getInitialVideoFile()]
    }
}

// create slice
export const videoSourceAdapter = createEntityAdapter()

export const initialState = videoSourceAdapter.getInitialState({
    editedVideoSource: getInitialVideoSource(),
})

export const videoSourceSlice = createSlice({
    name: 'videoSources',
    initialState,
    reducers: {
        videoSourcesLoaded: videoSourceAdapter.setMany,
        videoSourceLoaded: videoSourceAdapter.setOne,
        beganEditingVideoSource: (state, action) => {
            let {payload: videoSource} = action
            let edit = getObjectForEditing(videoSource)
            return {
                ...state,
                editedVideoSource: edit,
            }
        },
        editedVideoSourceUpdated: (state, action) => {
            let {payload} = action
            return {
                ...state,
                editedVideoSource: {
                    ...state.editedVideoSource,
                    [payload.field]: {
                        value: payload.value,
                        valid: validateField(payload.value),
                    },
                }
            }
        },
        videoFileAdded: (state) => {
            return {
                ...state,
                editedVideoSource: {
                    ...state.editedVideoSource,
                    videoFiles: [
                        ...state.editedVideoSource.videoFiles,
                        getInitialVideoFile(),
                    ]
                }
            }
        },
        videoFileDeleted: (state, action) => {
            let {payload: videoFile} = action
            let edited = state.editedVideoSource
            if (edited.videoFiles.length === 1) {
                return state    // don't delete only VideoFile field
            }
            let updatedVideoFiles = removeVideoFile(edited, videoFile)
            return {
                ...state,
                editedVideoSource: {
                    ...edited,
                    videoFiles: updatedVideoFiles,
                }
            }
        },
        videoFileUpdated: (state, action) => {
            let {payload: videoFile} = action
            let edited = state.editedVideoSource
            let updated = edited.videoFiles.map(file => {
                if (file.videoFileId.value === videoFile.videoFileId.value) {
                    return videoFile
                }
                return file
            })
            return {
                ...state,
                editedVideoSource: {
                    ...edited,
                    videoFiles: updated,
                }
            }
        },
        videoSourceDialogFinished: (state) => {
            // reset form data
            return {
                ...state,
                editedVideoSource: getInitialVideoSource(),
            }
        }
    }
})

export default videoSourceSlice.reducer

export const {
    videoSourcesLoaded,
    beganEditingVideoSource,
    editedVideoSourceUpdated,
    videoFileAdded,
    videoFileDeleted,
    videoFileUpdated,
    videoSourceDialogFinished,
} = videoSourceSlice.actions

export const {
    selectById: selectVideoSourceById,
} = videoSourceAdapter.getSelectors(state => state.fileSources ?? initialState)

export const selectEditedVideoSource = createSelector(
    state => state.fileSources,
    state => state.editedVideoSource
)

export const selectIsEditedVideoSourceValid = createSelector(
    selectEditedVideoSource,
    source =>
        Object.values(source).map(field =>
            !Array.isArray(field) ?
                validateField(field['value']) :
                field.reduce((valid, videoFile) =>
                    valid && validateVideoFile(videoFile), true)
        ).reduce((valid, fieldValid) => valid && fieldValid, true)
)

export const selectVideoSourceForUpload = createSelector(
    selectEditedVideoSource,
    edited => getObjectForUpload(edited)
)