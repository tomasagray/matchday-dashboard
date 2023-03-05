import {createSelector, createSlice} from "@reduxjs/toolkit";
import {settingsTag} from "./api/apiSlice";

const editedSettings = {
  artworkStorageLocation: '',
  logFilename: '',
  pruneVideos: '',
  refreshEvents: '',
  timestamp: '',
  videoExpiredDays: 0,
  videoStorageLocation: '',
  backupLocation: '',
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: editedSettings,
  tagTypes: [settingsTag],
  reducers: {
    loadSettings(state, action) {
      return {
        ...action.payload.settings
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
      const { timestamp, ...upload } = state
      return upload
    }
)