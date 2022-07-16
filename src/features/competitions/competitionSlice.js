import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";


export const competitionAdapter = createEntityAdapter()

export const initialState = competitionAdapter.getInitialState()

export const competitionSlice = createSlice({
    name: 'competitions',
    initialState,
    reducers: {
        allCompetitionsLoaded: competitionAdapter.setAll,
        competitionsLoaded: competitionAdapter.setMany,
        competitionLoaded: competitionAdapter.setOne,
    }
})

export const {
    allCompetitionsLoaded,
    competitionsLoaded,
    competitionLoaded,
} = competitionSlice.actions

export default competitionSlice.reducer

export const {
    selectById: selectCompetitionById,
    selectAll: selectAllCompetitions
} = competitionAdapter.getSelectors(state => state.competitions)
