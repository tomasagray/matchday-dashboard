import {
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import {formatArtworkData, updateSelectedArtwork} from "../app/utils";

export const teamAdapter = createEntityAdapter()
// white
const DEFAULT_COLOR = {
    hsl: {
        h: 60,
        s: 0,
        l: 1,
        a: 1,
    },
    hex: '#ffffff',
    rgb: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
    },
    hsv: {
        h: 60,
        s: 0,
        v: 1,
        a: 1,
    },
    oldHue: 60,
    source: 'hex',
}
const editedTeam = {
    newSynonym: null,
    colors: [],
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
            let {id, name, country, colors, emblem, fanart} = team
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    id,
                    name,
                    country: country?.name,
                    colors,
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
        updateArtworkCollection: (state, action) => {
            let {payload} = action
            let {collection} = payload
            let role = collection.role.toLowerCase()
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    [role]: formatArtworkData(collection)
                }
            }
        },
        setTeamColor: (state, action) => {
            let {payload} = action
            let {color, priority} = payload
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    colors: Object.assign(
                        [],
                        state.editedTeam.colors,
                        { [priority]: color }
                    )
                }
            }
        },
        addTeamColor: (state) => {
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    colors: [
                        ...state.editedTeam.colors,
                        DEFAULT_COLOR,
                    ]
                }
            }
        },
        deleteTeamColor: (state, action) => {
            let {payload} = action
            let {priority} = payload
            return {
                ...state,
                editedTeam: {
                    ...state.editedTeam,
                    colors: [
                        ...state.editedTeam.colors.slice(0, priority),
                        ...state.editedTeam.colors.slice(priority+1)
                    ]
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
    updateArtworkCollection,
    setTeamColor,
    addTeamColor,
    deleteTeamColor,
} = teamSlice.actions

export default teamSlice.reducer

export const selectAllTeams = createSelector(
    state => state.teams,
    state => state,
)

export const selectEditedTeam = createSelector(
    selectAllTeams,
    state => state.editedTeam,
)

export const selectEditedTeamForUpload = createSelector(
    selectEditedTeam,
    editedTeam => {
        const {newSynonym, ...uploadTeam} = editedTeam
        return {
            ...uploadTeam,
            colors: uploadTeam.colors?.map(color => {
                return {
                    red: color.rgb.r,
                    green: color.rgb.g,
                    blue: color.rgb.b,
                    alpha: color.rgb.a,
                }
            })
        }
    }
)
