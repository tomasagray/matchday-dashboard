import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";

const EMAIL_REGEX = /([\w.-]+)@([\w-]+)((\.(\w){2,})+)/

export const userAdapter = createEntityAdapter({
    selectId: user => user.userId
})

const validateField = (field, value) => {
    switch (field) {
        case 'username':
            return EMAIL_REGEX.test(value)
        case 'cookieFile':
            let nameValid = value?.name !== '' ?? false
            let typeValid = value?.type === 'text/plain' ?? false
            return nameValid && typeValid
        default:
            return value !== ''
    }
}

const newFileServerUser = {
    username: {
        value: '',
        valid: false,
    },
    password: {
        value: '',
        valid: false,
    },
    cookieFile: {
        value: '',
        valid: false,
    },
}

const initialState = userAdapter.getInitialState({
    newFileServerUser,
})

export const {
    selectById: selectUserById
} = userAdapter.getSelectors(state => state.fileServerUsers ?? initialState)

export const fileServerUserSlice = createSlice({
    name: 'fileServerUsers',
    initialState,
    reducers: {
        usersLoaded: userAdapter.setMany,
        userLoaded: userAdapter.setOne,
        userUpdated: userAdapter.setOne,
        userDeleted: userAdapter.removeOne,
        newUserUpdated: (state, action) => {
            let payload = action.payload
            let {field, value} = payload
            state.newFileServerUser = {
                ...state.newFileServerUser,
                [field]: {
                    value,
                    valid: validateField(field, value)
                },
            }
        },
        newUserCleared: (state) => {
            state.newFileServerUser = newFileServerUser
        },
    }
})

export default fileServerUserSlice.reducer

export const {
    newUserUpdated,
    newUserCleared,
} = fileServerUserSlice.actions

export const selectNewUser = createSelector(
    state => state.fileServerUsers,
    state => state.newFileServerUser
)

export const selectCookiesForUser = createSelector(
    selectUserById,
    (state, userId) => userId,
    (user) => user?.cookies ?? []
)
