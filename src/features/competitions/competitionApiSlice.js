import {apiSlice, competitionTag, eventTag, teamTag} from "../../app/apiSlice";
import {allCompetitionsLoaded, competitionAdapter, competitionLoaded} from "./competitionSlice";
import store from "../../app/store";
import {teamAdapter, teamsLoaded} from "../teams/teamSlice";
import {JsonHeaders} from "../../app/constants";


export const competitionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchAllCompetitions: builder.query({
                query: () => '/competitions',
                providesTags: [competitionTag],
                transformResponse: (response) => {
                    let {_embedded} = response
                    if (_embedded) {
                        let {competitions} = _embedded
                        store.dispatch(allCompetitionsLoaded(competitions))
                        return competitionAdapter.setAll(competitionAdapter.getInitialState(), competitions)
                    }
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
                    let {_embedded} = response
                    if (_embedded) {
                        let {teams} = _embedded
                        store.dispatch(teamsLoaded(teams))
                        return teamAdapter.setAll(teamAdapter.getInitialState(), teams)
                    }
                }
            }),
            updateCompetition: builder.mutation({
                query: (competition) =>
                    ({
                        url: `/competitions/competition/${competition.id}/update`,
                        method: 'PATCH',
                        headers: JsonHeaders,
                        body: competition,
                    }),
                invalidatesTags: [competitionTag, eventTag]
            })
        })
    }
})

export const {
    useFetchAllCompetitionsQuery,
    useFetchCompetitionByIdQuery,
    useFetchTeamsForCompetitionQuery,
    useUpdateCompetitionMutation,
} = competitionApiSlice
