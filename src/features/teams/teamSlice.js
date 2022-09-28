import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {formatArtworkData, updateSelectedArtwork} from "../../app/utils";

export const teamAdapter = createEntityAdapter()
const editedTeam = {
    newSynonym: null
}

export const initialState = teamAdapter.getInitialState({
    editedTeam,
})

export const teamSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        allTeamsLoaded: teamAdapter.setAll,
        teamsLoaded: teamAdapter.setMany,
        teamLoaded: teamAdapter.setOne,
        beginEditingTeam: (state, action) => {
            let {payload} = action
            let {team} = payload
            let {id, name, country, emblem, fanart} = team
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    id,
                    name,
                    country: country?.name,
                    emblem: formatArtworkData(emblem),
                    fanart: formatArtworkData(fanart)
                }
            }
        },
        editTeamTitle: (state, action) => {
            let {payload} = action
            let {title} = payload
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    name: {
                        ...state.editedTeam.name,
                        name: title,
                    }
                }
            }
        },
        editNewSynonym: (state, action) => {
            let {payload} = action
            let {synonym} = payload
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    newSynonym: {
                        name: synonym
                    },
                }
            }
        },
        addTeamSynonym: (state, action) => {
            let {payload} = action
            let {synonym} = payload
            // check for presence of synonym
            if (state.editedTeam.name.synonyms.includes(synonym)) {
                // if so, discard, clear input
                return {
                    ...state,
                    editedTeam: {
                        ...state.editedTeam,
                        newSynonym: {}
                    }
                }
            }
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    name: {
                        ...state.editedTeam.name,
                        synonyms: [
                            ...state.editedTeam.name.synonyms,
                            synonym
                        ],
                    },
                    newSynonym: '',
                }
            }
        },
        deleteTeamSynonym: (state, action) => {
            let {payload} = action
            let {synonym} = payload
            // get a mutable copy
            const existingSynonyms = [...state.editedTeam.name.synonyms]
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    name: {
                        ...state.editedTeam.name,
                        synonyms: existingSynonyms.filter(sy => sy.name !== synonym),
                    }
                }
            }
        },
        setTeamCountry: (state, action) => {
            let {payload} = action
            let {country} = payload
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    country
                }
            }
        },
        uploadTeamArtwork: (state, action) => {
            let {payload} = action
            let {artwork: _artworks} = payload
            let {id, role, selectedIndex, artwork} = _artworks
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    [role.toLowerCase()]: {
                        id,
                        role,
                        selectedIndex,
                        collection: artwork['_embedded']['artworks']
                    },
                }
            }
        },
        selectTeamArtwork: (state, action) => {
            let {payload} = action
            let {selection, role} = payload
            let {selectedId} = selection
            const artworkCollection = {...state.editedTeam[role].collection}
            const {selectedIndex, updatedCollection} = updateSelectedArtwork(selectedId, artworkCollection)
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    [role]: {
                        ...state.editedTeam[role],
                        selectedIndex,
                        collection: updatedCollection,
                    }
                }
            }
        },
    }
})

export const {
    teamsLoaded,
    teamLoaded,
    beginEditingTeam,
    editTeamTitle,
    editNewSynonym,
    addTeamSynonym,
    deleteTeamSynonym,
    setTeamCountry,
    uploadTeamArtwork,
    selectTeamArtwork,
} = teamSlice.actions

export default teamSlice.reducer

export const selectEditedTeam = createSelector(
    state => state.teams,
    state => state.editedTeam,
)

export const selectEditedTeamForUpload = createSelector(
    selectEditedTeam,
    editedTeam => {
        const {newSynonym, ...uploadTeam} = editedTeam
        return uploadTeam
    }
)
