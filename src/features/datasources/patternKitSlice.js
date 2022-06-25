import {createSelector, createSlice} from "@reduxjs/toolkit";

const initialNewPatternKit = {
    type: {
        value: null,
        valid: false,
    },
    pattern: {
        value: '',
        valid: false,
    },
    fields: {
        value: {},
        valid: false,
        requiredFields: 0,
    },
}

const isFieldValid = (payload) => {
    switch (payload.field) {
        case 'type':
            return payload.value !== 'placeholder'
        case 'pattern':
            return payload.value !== ''
        default:
            return false
    }
}

export const patternKitSlice = createSlice({
    name: 'patternKits',
    initialState: {
        newPatternKit: initialNewPatternKit,
    },
    reducers: {
        newPatternKitUpdated(state, action) {
            let payload = action.payload;
            state.newPatternKit = {
                ...state.newPatternKit,
                [payload.field]: {
                    value: payload.value,
                    valid: isFieldValid(payload),
                }
            }
        },
        newPatternKitTypeSelected(state, action) {
            let template = action.payload
            let requiredFields = Object.keys(template.fields).length
            let type = template.type;
            state.newPatternKit = {
                ...state.newPatternKit,
                type: {
                    value: type,
                    valid: type !== 'placeholder'
                },
                fields: {
                    value: {},
                    valid: false,
                    requiredFields,
                },
            }
        },
        newPatternKitFieldsUpdated(state, action) {
            let newPatternKit = state.newPatternKit
            let payload = action.payload
            let fields = payload.value
            let fieldCount = Object.values(fields).filter(field => {
                console.log('field is', field)
                return field !== null
            }).length
            state.newPatternKit = {
                ...newPatternKit,
                fields: {
                    ...newPatternKit.fields,
                    value: fields,
                    valid: fieldCount === newPatternKit.fields.requiredFields
                }
            }
        },
        clearNewPatternKit(state) {
            console.log('clearing...')
            state.newPatternKit = initialNewPatternKit
        },
    }
})

export default patternKitSlice.reducer

export const {
    newPatternKitUpdated,
    newPatternKitTypeSelected,
    newPatternKitFieldsUpdated,
    clearNewPatternKit,
} = patternKitSlice.actions

export const selectNewPatternKit = createSelector(
    state => state.patternKits,
    state => state.newPatternKit
)

export const selectIsNewPatternKitValid = createSelector(
    selectNewPatternKit,
    patternKit =>
        Object.values(patternKit)
            .map(field => field.valid)
            .reduce((isValid, isFieldValid) => isValid && isFieldValid)
)

export const selectNewPatternKitForUpload = createSelector(
    selectNewPatternKit,
    patternKit => {
        return {
            clazz: patternKit.type.value,
            pattern: patternKit.pattern.value,
            fields: patternKit.fields.value,
            id: null,
        }
    }
)
