import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";

export const matchAdapter = createEntityAdapter({
    selectId: match => match['eventId']
})

const initialState = matchAdapter.getInitialState()

export const matchSlice = createSlice({
    name: 'matches',
    initialState,
    reducers: {
        matchesLoaded: matchAdapter.setMany,
        matchLoaded: matchAdapter.setOne,
    }
})

export default matchSlice.reducer

export const {
    matchesLoaded,
    matchLoaded,
} = matchSlice.actions
