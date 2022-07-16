import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";

export const teamAdapter = createEntityAdapter()

export const initialState = teamAdapter.getInitialState()

export const teamSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        allTeamsLoaded: teamAdapter.setAll,
        teamsLoaded: teamAdapter.setMany,
        teamLoaded: teamAdapter.setOne,
    }
})

export const {
    teamsLoaded,
    teamLoaded,
} = teamSlice.actions

export default teamSlice.reducer
