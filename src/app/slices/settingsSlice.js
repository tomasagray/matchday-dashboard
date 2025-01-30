import {createSelector, createSlice} from "@reduxjs/toolkit";
import {settingsTag} from "./api/apiSlice";


export const REFRESH_DATASOURCES = '/tasks/refresh_datasources'
export const PRUNE_VIDEOS = '/tasks/prune_videos'
export const VIDEO_EXPIRE_DAYS = '/tasks/video_expire_days'
export const BACKUP_LOCATION = '/filesystem/backup_location'
export const VIDEO_LOCATION = '/filesystem/video_location'
export const ARTWORK_LOCATION = '/filesystem/artwork/storage_location'
export const LOG_FILE = '/filesystem/log_location'
export const FFMPEG_BASE_ARGS = '/plugin/ffmpeg/ffmpeg/base-args'
export const FFMPEG_ADD_ARGS = '/plugin/ffmpeg/ffmpeg/additional-args'
export const VPN_HEARTBEAT = '/tasks/vpn_heartbeat'
export const UNPROTECTED_IP = '/system/network/address/unprotected'


const editedSettings = {
    [REFRESH_DATASOURCES]: null,
    [PRUNE_VIDEOS]: null,
    [VIDEO_EXPIRE_DAYS]: null,
    [BACKUP_LOCATION]: null,
    [VIDEO_LOCATION]: null,
    [ARTWORK_LOCATION]: null,
    [LOG_FILE]: null,
    [FFMPEG_BASE_ARGS]: null,
    [FFMPEG_ADD_ARGS]: null,
    [VPN_HEARTBEAT]: null,
    [UNPROTECTED_IP]: null,
}

const addFFmpegArgument = (state, action, args) => {
    let {payload: argument} = action
    if (state[args].data.includes(argument))
        return state

    return {
        ...state,
        [args]: {
            ...state[args],
            data: [
                ...state[args].data,
                argument
            ]
        }
    }
}

const deleteFFmpegArgument = (state, action, args) => {
    let {payload: argument} = action
    let updatedArgs = state[args].data.filter(arg => arg !== argument)

    return {
        ...state,
        [args]: {
            ...state[args],
            data: updatedArgs
        }
    }
}

const moveFFmpegArgument = (state, action, args) => {
    let {payload} = action
    let {from, to} = payload
    if (from === to) return state

    let updated = [...state[args].data]
    let movedValue = updated[from]

    if (from > to) {
        // delete from old position
        updated.splice(from, 1)
        // move to new position
        updated.splice(to, 0, movedValue)
    } else {
        updated.splice(to, 0, movedValue)
        updated.splice(from, 1)
    }

    return {
        ...state,
        [args]: {
            ...state[args],
            data: updated,
        },
    }
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: editedSettings,
    tagTypes: [settingsTag],
    reducers: {
        loadSettings(state, action) {
            return {
                ...action.payload
            }
        },
        editSettings(state, action) {
            let {payload} = action
            let {field, value} = payload
            return {
                ...state,
                [field]: value
            }
        },
        addNewFFmpegBaseArg(state, action) {
            return addFFmpegArgument(state, action, FFMPEG_BASE_ARGS)
        },
        deleteFFmpegBaseArg(state, action) {
            return deleteFFmpegArgument(state, action, FFMPEG_BASE_ARGS)
        },
        moveFFmpegBaseArg(state, action) {
            return moveFFmpegArgument(state, action, FFMPEG_BASE_ARGS)
        },
        addFFmpegAdditionalArg(state, action) {
            return addFFmpegArgument(state, action, FFMPEG_ADD_ARGS)
        },
        deleteFFmpegAdditionalArg(state, action) {
            return deleteFFmpegArgument(state, action, FFMPEG_ADD_ARGS)
        },
        moveFFmpegAdditionalArg(state, action) {
            return moveFFmpegArgument(state, action, FFMPEG_ADD_ARGS)
        },
    }
})

export const {
    loadSettings,
    editSettings,
    addNewFFmpegBaseArg,
    deleteFFmpegBaseArg,
    moveFFmpegBaseArg,
    addFFmpegAdditionalArg,
    deleteFFmpegAdditionalArg,
    moveFFmpegAdditionalArg,
} = settingsSlice.actions;

export default settingsSlice.reducer

export const selectEditedSettings = createSelector(
    state => state,
    state => state.settings
)

export const selectUploadSettings = createSelector(
    selectEditedSettings,
    state => {
        return {
            settings: state
        }
    }
)