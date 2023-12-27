import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";


export const matchAdapter = createEntityAdapter({
    selectId: match => match['eventId']
})

const editedMatch = {
    competition: null,
    homeTeam: null,
    awayTeam: null,
    season: null,
    fixture: 1,
    date: null,
    fileSources: [],
}

const initialState = matchAdapter.getInitialState({
    editedMatch,
})

export const matchSlice = createSlice({
    name: 'matches',
    initialState,
    reducers: {
        matchesLoaded: matchAdapter.setMany,
        matchLoaded: matchAdapter.setOne,
        beginEditMatch: (state, action) => {
            let {payload: event} = action
            return {
                ...state,
                editedMatch: {
                    ...event,
                    fileSources: [],
                },
            }
        },
        updateEditedMatch: (state, action) => {
            let {payload} = action
            let {field, value} = payload
            return {
                ...state,
                editedMatch: {
                    ...state.editedMatch,
                    [field]: value,
                }
            }
        },
        addVideoSource: (state, action) => {
            let {payload: videoSource} = action
            let updatedSources =
                state.editedMatch.fileSources.filter(source => source.id !== videoSource.id)
            return {
                ...state,
                editedMatch: {
                    ...state.editedMatch,
                    fileSources: [videoSource, ...updatedSources]
                },
            }
        },
        deleteVideoSource: (state, action) => {
            let {payload: videoSource} = action
            let upload = state.editedMatch.fileSources.filter(source => source.id !== videoSource.id)
            return {
                ...state,
                editedMatch: {
                    ...state.editedMatch,
                    fileSources: upload,
                }
            }
        },
        finishEditMatch: (state) => {
            return {
                ...state,
                editedMatch,
            }
        },
    }
})

export default matchSlice.reducer

export const {
    matchLoaded,
    beginEditMatch,
    updateEditedMatch,
    addVideoSource,
    deleteVideoSource,
    finishEditMatch,
} = matchSlice.actions

export const selectMatches = createSelector(
    state => state.events,
    state => state
)

export const selectEditedMatch = createSelector(
    state => state.events,
    state => state.editedMatch,
)

export const selectIsEditedMatchValid = createSelector(
    selectEditedMatch,
    editedMatch => {
        if (editedMatch.date === undefined || editedMatch.date === null) {
            return {
                isValid: false,
                reason: 'Please specify a date',
            }
        }
        if (editedMatch.competition === undefined || editedMatch.competition === null) {
            return {
                isValid: false,
                reason: 'Please set a Competition',
            }
        }
        if (editedMatch.homeTeam === undefined || editedMatch.homeTeam === null ||
            editedMatch.awayTeam === undefined || editedMatch.awayTeam === null) {
            return {
                isValid: false,
                reason: 'Please set Teams',
            }
        }
        if (editedMatch.homeTeam === editedMatch.awayTeam) {
            return {
                isValid: false,
                reason: 'Please choose two different teams'
            }
        }
        if (editedMatch.fileSources.length < 1) {
            return {
                isValid: false,
                reason: 'Please add at least 1 video source'
            };
        }
        return {
            isValid: true,
        };
    }
)

export const selectEditedMatchForUpload = createSelector(
    selectEditedMatch,
    editedMatch => {
        let competition = {
            id: editedMatch.competition?.id,
            name: editedMatch.competition?.name,
        }
        let homeTeam = {
            id: editedMatch.homeTeam?.id,
            name: editedMatch.homeTeam?.name,
        }
        let awayTeam = {
            id: editedMatch.awayTeam?.id,
            name: editedMatch.awayTeam?.name,
        }
        let uploadableSources = editedMatch.fileSources.map(source => {
            let {videoFiles, ...uploadSource} = source
            return {
                ...uploadSource,
                videoFilePacks: [{
                    videoFiles: source.videoFiles
                }]
            }
        })
        return {
            ...editedMatch,
            competition,
            homeTeam,
            awayTeam,
            fileSources: uploadableSources,
        }
    },
)
