import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {formatArtworkData, getUploadArtwork, updateSelectedArtwork} from "../utils";


export const competitionAdapter = createEntityAdapter()
export const editedCompetition = {
    id: null,
    name: {
        synonyms: []
    },
    country: null,
    emblem: null,
    fanart: null,
    synonyms: [],
    newSynonym: {},
}
export const initialState = {editedCompetition}

export const competitionSlice = createSlice({
    name: 'competitions',
    initialState,
    reducers: {
        beginEditingCompetition: (state, action) => {
            let {payload} = action
            let {competition} = payload
            let {id, name, country, emblem, fanart} = competition
            return {
                ...state,
                editedCompetition: {
                    ...state.editedCompetition,
                    id,
                    name,
                    country,
                    emblem: formatArtworkData(emblem),
                    fanart: formatArtworkData(fanart),
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
                    },
                }
            }
        },
        addCompetitionSynonym: (state, action) => {
            let {payload} = action
            let {synonym} = payload
            // synonym already present for this entity?
            let names = state.editedCompetition.name.synonyms.map(syn => syn.name)
            if (names.includes(synonym.name)) {
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
                        synonyms: existingSynonyms.filter(sy => sy.name !== synonym.name),
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
            let {id, role, selectedIndex, collection: artwork} = _artworks
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
        },
        updateArtworkCollection: (state, action) => {
            let {payload} = action
            let {collection} = payload
            let role = collection.role.toLowerCase()
            return {
                ...state,
                editedCompetition: {
                    ...state.editedCompetition,
                    [role]: formatArtworkData(collection)
                }
            }
        },
        finishEditingCompetition: (state) => {
            return {
                ...state,
                editedCompetition: editedCompetition,
            }
        },
    }
})

export const {
    beginEditingCompetition,
    editCompetitionTitle,
    editNewSynonym,
    addCompetitionSynonym,
    deleteCompetitionSynonym,
    setCompetitionCountry,
    uploadArtwork,
    selectArtwork,
    updateArtworkCollection,
    finishEditingCompetition,
} = competitionSlice.actions

export default competitionSlice.reducer

export const selectEditedCompetition = createSelector(
    state => state.competitions,
    state => state.editedCompetition,
)

export const selectIsEditedCompetitionValid = createSelector(
    selectEditedCompetition,
    editedCompetition => {
        if (editedCompetition.name?.name === undefined || editedCompetition.name.name === '') {
            return {
                isValid: false,
                reason: 'A name is required',
            }
        }
        if (editedCompetition.country === undefined || editedCompetition.country === null) {
            return {
                isValid: false,
                reason: 'Please specify a country',
            }
        }
        return {
            isValid: true,
        }
    }
)

export const selectEditedCompetitionForUpload = createSelector(
    selectEditedCompetition,
    editedCompetition => {
        const {newSynonym, ...uploadCompetition} = editedCompetition
        return {
            ...uploadCompetition,
            emblem: getUploadArtwork(uploadCompetition.emblem),
            fanart: getUploadArtwork(uploadCompetition.fanart),
        }
    }
)
