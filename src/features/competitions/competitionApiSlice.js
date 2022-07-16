import {apiSlice, competitionTag, teamTag} from "../../app/apiSlice";
import {allCompetitionsLoaded, competitionAdapter, competitionLoaded} from "./competitionSlice";
import store from "../../app/store";
import {teamAdapter, teamsLoaded} from "../teams/teamSlice";


export const competitionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchAllCompetitions: builder.query({
                query: () => '/competitions',
                providesTags: [competitionTag],
                transformResponse: (response) => {
                    let competitions = response['_embedded']['competitions'];
                    store.dispatch(allCompetitionsLoaded(competitions))
                    return competitionAdapter.setAll(competitionAdapter.getInitialState(), competitions)
                },
            }),
            fetchCompetitionById: builder.query({
                query: (competitionId) => `/competitions/competition/${competitionId}`,
                providesTags: [competitionTag],
                transformResponse: (response) => {
                    store.dispatch(competitionLoaded(response))
                    return response
                },
            }),
            fetchTeamsForCompetition: builder.query({
                query: (competitionId) => `/competitions/competition/${competitionId}/teams`,
                providesTags: [teamTag],
                transformResponse: (response) => {
                    let teams = response['_embedded'].teams
                    store.dispatch(teamsLoaded(teams))
                    return teamAdapter.setAll(teamAdapter.getInitialState(), teams)
                }
            }),
        })
    }
})

export const {
    useFetchAllCompetitionsQuery,
    useFetchCompetitionByIdQuery,
    useFetchTeamsForCompetitionQuery,
} = competitionApiSlice
