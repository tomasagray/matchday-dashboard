import {apiSlice, competitionTag, teamTag} from "../../app/apiSlice";
import {teamAdapter, teamLoaded, teamsLoaded} from "./teamSlice";
import store from "../../app/store";
import {competitionAdapter, competitionsLoaded} from "../competitions/competitionSlice";

export const teamApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchAllTeams: builder.query({
                query: () => '/teams',
                providesTags: [teamTag],
                transformResponse: (response) => {
                    const teams = response['_embedded']['teams']
                    store.dispatch(teamsLoaded(teams))
                    return teamAdapter.setAll(teamAdapter.getInitialState(), teams)
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
                    let competitions = response['_embedded'].competitions
                    store.dispatch(competitionsLoaded(competitions))
                    return competitionAdapter.setAll(competitionAdapter.getInitialState(), competitions)
                }
            }),
        })
    }

})

export const {
    useFetchAllTeamsQuery,
    useFetchTeamByIdQuery,
    useFetchCompetitionsForTeamQuery,
} = teamApiSlice
