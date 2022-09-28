import {apiSlice, competitionTag, eventTag, teamTag} from "../../app/apiSlice";
import {teamAdapter, teamLoaded, teamsLoaded} from "./teamSlice";
import store from "../../app/store";
import {competitionAdapter, competitionsLoaded} from "../competitions/competitionSlice";
import {JsonHeaders} from "../../app/constants";

export const teamApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchAllTeams: builder.query({
                query: () => '/teams',
                providesTags: [teamTag],
                transformResponse: (response) => {
                    let {_embedded} = response
                    if (_embedded) {
                        let {teams} = _embedded
                        store.dispatch(teamsLoaded(teams))
                        return teamAdapter.setAll(teamAdapter.getInitialState(), teams)
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
} = teamApiSlice
