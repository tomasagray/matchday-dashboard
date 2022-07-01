import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";

export const userAdapter = createEntityAdapter({
    selectId: user => user.userId
})

const initialState = userAdapter.getInitialState()

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById
} = userAdapter.getSelectors(state => state.fileServerUsers ?? initialState)

export const fileServerUserSlice = createSlice({
    name: 'fileServerUsers',
    initialState,
    reducers: {
        usersLoaded: userAdapter.setMany,
    }
})

export default fileServerUserSlice.reducer

export const {
    usersLoaded,
} = fileServerUserSlice.actions
