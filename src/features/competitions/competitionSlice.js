import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";


export const competitionAdapter = createEntityAdapter()
export const editedCompetition = {
    id: null,
    name: null,
    country: null,
    newSynonym: {},
}
export const initialState = competitionAdapter.getInitialState({
    editedCompetition,
})

export const competitionSlice = createSlice({
    name: 'competitions',
    initialState,
    reducers: {
        allCompetitionsLoaded: competitionAdapter.setAll,
        competitionsLoaded: competitionAdapter.setMany,
        competitionLoaded: competitionAdapter.setOne,
        beginEditingCompetition: (state, action) => {
            let {payload} = action
            let {competition} = payload
            let {_links, ...noLinks} = competition
            return {
                ...state,
                editedCompetition: noLinks,
            }
        },
        editCompetitionTitle: (state, action) => {
          let {payload} = action
          let {title} = payload
          return {
              ...state,
              editedCompetition: {
                  ...state.editedCompetition,
                  name: {
                      ...state.editedCompetition.name,
                      name: title,
                  }
              }
          }
        },
        editNewSynonym: (state, action) => {
          let {payload} = action
          let {newSynonym} = payload
          return {
              ...state,
              editedCompetition: {
                  ...state.editedCompetition,
                  newSynonym: {
                      name: newSynonym,
                      // properName: state.editedCompetition.name,
                  },
              }
          }
        },
        addCompetitionSynonym: (state, action) => {
            let {payload} = action
            let {synonym} = payload
            // synonym already present for this entity?
            if (state.editedCompetition.name.synonyms.includes(synonym)) {
                // if so, discard, clear input
                return {
                    ...state,
                    editedCompetition: {
                        ...state.editedCompetition,
                        newSynonym: {}
                    }
                }
            }
            return {
                ...state,
                editedCompetition: {
                    ...state.editedCompetition,
                    name: {
                        ...state.editedCompetition.name,
                        synonyms: [
                            ...state.editedCompetition.name.synonyms,
                            synonym
                        ],
                    },
                    newSynonym: '',
                }
            }
        },
        deleteCompetitionSynonym: (state, action) => {
            let {payload} = action
            let {synonym} = payload
            // get a mutable copy
            const existingSynonyms = [...state.editedCompetition.name.synonyms]
            return {
                ...state,
                editedCompetition: {
                    ...state.editedCompetition,
                    name: {
                        ...state.editedCompetition.name,
                        synonyms: existingSynonyms.filter(sy => sy.name !== synonym),
                    }
                }
            }
        },
        setCompetitionCountry: (state, action) => {
            let {payload} = action
            let {country} = payload
            return {
                ...state,
                editedCompetition: {
                    ...state.editedCompetition,
                    country
                }
            }
        },
    }
})

export const {
    allCompetitionsLoaded,
    competitionsLoaded,
    competitionLoaded,
    beginEditingCompetition,
    editCompetitionTitle,
    editNewSynonym,
    addCompetitionSynonym,
    deleteCompetitionSynonym,
    setCompetitionCountry,
} = competitionSlice.actions

export default competitionSlice.reducer

export const selectEditedCompetition = createSelector(
    state => state.competitions,
    state => state.editedCompetition,
)

export const selectEditedCompetitionForUpload = createSelector(
    selectEditedCompetition,
    editedCompetition => {
        const {newSynonym, ...uploadCompetition} = editedCompetition
        return uploadCompetition
    }
)
