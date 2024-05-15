import {createSelector, createSlice} from "@reduxjs/toolkit";
import {settingsTag} from "./api/apiSlice";


export const REFRESH_DATASOURCES = '/tasks/refresh_datasources'
export const PRUNE_VIDEOS = '/tasks/prune_videos'
export const VIDEO_EXPIRE_DAYS = '/tasks/video_expire_days'
export const BACKUP_LOCATION = '/filesystem/backup_location'
export const VIDEO_LOCATION = '/filesystem/video_location'
export const ARTWORK_LOCATION = '/filesystem/artwork/storage_location'
export const LOG_FILE = '/filesystem/log_location'


const editedSettings = {
    [REFRESH_DATASOURCES]: null,
    [PRUNE_VIDEOS]: null,
    [VIDEO_EXPIRE_DAYS]: null,
    [BACKUP_LOCATION]: null,
    [VIDEO_LOCATION]: null,
    [ARTWORK_LOCATION]: null,
    [LOG_FILE]: null,
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
    }
})

export const {
    loadSettings,
    editSettings,
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