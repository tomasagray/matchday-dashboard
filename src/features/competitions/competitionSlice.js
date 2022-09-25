import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";


export const competitionAdapter = createEntityAdapter()
export const editedCompetition = {
    id: null,
    name: null,
    country: null,
    emblem: null,
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
            let {id, name, country, emblem} = competition
            let {artwork, ...emblemCollection} = emblem
            let {_embedded: embedded} = artwork
            let collection = embedded ? embedded['artworks'] : null
            return {
                ...state,
                editedCompetition: {
                    ...state.editedCompetition,
                    id,
                    name,
                    country: country?.name,
                    emblem: {
                        ...emblemCollection,
                        collection,
                    },
                },
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
        uploadArtwork: (state, action) => {
            let {payload} = action
            let {artwork: _artworks} = payload
            let {id, role, selectedIndex, artwork} = _artworks
            return {
                ...state,
                editedCompetition: {
                    ...state.editedCompetition,
                    [role.toLowerCase()]: {
                        id,
                        role,
                        selectedIndex,
                        collection: artwork['_embedded']['artworks']
                    },
                }
            }
        },
        selectArtwork: (state, action) => {
            let {payload} = action
            let {selection, role} = payload
            let {selectedId} = selection
            const artworkCollection = {...state.editedCompetition[role].collection}
            const {selectedIndex, updatedCollection} = updateSelectedArtwork(selectedId, artworkCollection)
            return {
                ...state,
                editedCompetition: {
                    ...state.editedCompetition,
                    [role]: {
                        ...state.editedCompetition[role],
                        selectedIndex,
                        collection: updatedCollection,
                    }
                }
            }
        }
    }
})

const updateSelectedArtwork = (selectedId, artworkCollection) => {
    let collection = Object.values(artworkCollection)
    let selectedIndex = 0
    let updatedCollection = []
    for (let i = 0; i < collection.length; i++) {
        if (collection[i].id === selectedId) {
            selectedIndex = i
            updatedCollection[i] = {
                ...collection[i],
                selected: true,
            }
        } else {
            updatedCollection[i] = {
                ...collection[i],
                selected: false,
            }
         }
    }
    return {selectedIndex, updatedCollection}
}

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
    uploadArtwork,
    selectArtwork,
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
