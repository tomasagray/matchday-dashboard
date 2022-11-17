import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";

export const matchAdapter = createEntityAdapter({
    selectId: match => match['eventId']
})

const initialState = matchAdapter.getInitialState({
    editedMatch: null,
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
                editedMatch: event,
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
        }
    }
})

export default matchSlice.reducer

export const {
    matchLoaded,
    beginEditMatch,
    updateEditedMatch,
} = matchSlice.actions

export const selectMatches = createSelector(
    state => state.events,
    state => state
)

export const selectEditedMatch = createSelector(
    state => state.events,
    state => state.editedMatch,
)

export const selectEditedMatchForUpload = createSelector(
    selectEditedMatch,
    editedMatch => {
        if (editedMatch === null) {
            return null
        }
        return {
            ...editedMatch,
            competition: {
                ...editedMatch.competition,
                country: editedMatch.competition.country?.name,
            },
            homeTeam: {
                ...editedMatch.homeTeam,
                country: editedMatch.homeTeam.country?.name,
            },
            awayTeam: {
                ...editedMatch.awayTeam,
                country: editedMatch.awayTeam.country?.name,
            },
        }
    }
)
