import {apiSlice, competitionTag, eventTag, teamTag} from "./apiSlice";
import {teamAdapter, teamLoaded, teamsLoaded, updateArtworkCollection} from "../teamSlice";
import store from "../../store";
import {competitionAdapter, competitionsLoaded} from "../competitionSlice";
import {JsonHeaders} from "../../constants";

const getNormalizedTeams = (response) => {
    let {teams} = response
    if (teams && teams.length > 0) {
        store.dispatch(teamsLoaded(teams))
        return teamAdapter.setMany(teamAdapter.getInitialState(), teams)
    }
}

export const teamApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchAllTeams: builder.query({
                query: (url = null, page = 0, size = 16) => {
                    if (url !== null) {
                        return {url}
                    }
                    return {
                        url: `/teams?page=${page}&size=${size}`,
                    }
                },
                providesTags: [teamTag],
                transformResponse: (response) => {
                    let {_embedded} = response
                    if (_embedded) {
                        let normalized = getNormalizedTeams(_embedded)
                        // todo - standardize whether returned data is wrapped in _embedded
                        return {
                            ...normalized,
                            next: response['_links']?.next?.href,
                        }
                    }
                }
            }),
            fetchTeamById: builder.query({
                query: (teamId) => `/teams/team/${teamId}`,
                providesTags: [teamTag],
                transformResponse: (response) => {
                    store.dispatch(teamLoaded(response))
                    return response
                }
            }),
            fetchCompetitionsForTeam: builder.query({
                query: (teamId) => `/teams/team/${teamId}/competitions`,
                providesTags: [competitionTag],
                transformResponse: (response) => {
                    let {_embedded} = response
                    if (_embedded) {
                        let {competitions} = _embedded
                        store.dispatch(competitionsLoaded(competitions))
                        return competitionAdapter.setAll(competitionAdapter.getInitialState(), competitions)
                    }
                }
            }),
            updateTeam: builder.mutation({
                query: (team) => ({
                    url: `/teams/team/${team.id}/update`,
                    method: 'PATCH',
                    headers: JsonHeaders,
                    body: team,
                }),
                invalidatesTags: [teamTag, eventTag],
            }),
            addTeamEmblem: builder.mutation({
                query: emblem => ({
                    url: `/teams/team/${emblem.entityId}/emblem/add`,
                    method: 'POST',
                    body: emblem.formData,
                }),
                invalidatesTags: [teamTag],
            }),
            addTeamFanart: builder.mutation({
                query: fanart => ({
                    url: `/teams/team/${fanart.entityId}/fanart/add`,
                    method: 'POST',
                    body: fanart.formData,
                }),
                invalidatesTags: [teamTag],
            }),
            deleteTeamEmblem: builder.mutation({
                query: req => ({
                    url: `/teams/team/${req.entityId}/emblem/${req.artwork.id}/remove`,
                    method: 'DELETE',
                }),
                invalidatesTags: [teamTag],
                transformResponse(response) {
                    store.dispatch(updateArtworkCollection({collection: response}))
                    return response
                }
            }),
            deleteTeamFanart: builder.mutation({
                query: req => ({
                    url: `/teams/team/${req.entityId}/fanart/${req.artwork.id}/remove`,
                    method: 'DELETE',
                }),
                invalidatesTags: [teamTag],
                transformResponse(response) {
                    store.dispatch(updateArtworkCollection({collection: response}))
                    return response
                }
            }),
            deleteTeam: builder.mutation({
                query: teamId => ({
                    url: `/teams/team/${teamId}/delete`,
                    method: 'DELETE',
                }),
                invalidatesTags: [teamTag],
            }),
        })
    }

})

export const {
    useFetchAllTeamsQuery,
    useFetchTeamByIdQuery,
    useFetchCompetitionsForTeamQuery,
    useUpdateTeamMutation,
    useAddTeamEmblemMutation,
    useAddTeamFanartMutation,
    useDeleteTeamEmblemMutation,
    useDeleteTeamFanartMutation,
    useDeleteTeamMutation,
} = teamApiSlice
