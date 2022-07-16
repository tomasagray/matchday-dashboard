import {apiSlice, eventTag} from "../../app/apiSlice";
import store from "../../app/store";
import {matchAdapter, matchLoaded, matchSlice} from "./matchSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchAllEvents: builder.query({
                query: () => '/events/',
                providesTags: [eventTag],
                transformResponse: (response) => {
                    const matches = response['matches']
                    store.dispatch(matchSlice.actions.matchesLoaded(matches))
                    // todo - handle highlights, other types?
                    return matchAdapter.setAll(matchAdapter.getInitialState(), matches)
                },
            }),
            fetchMatchesForTeam: builder.query({
                query: (teamId) => `/teams/team/${teamId}/matches`,
                providesTags: [eventTag],
                transformResponse: (response) => response['_embedded']['matches'],
            }),
            fetchEventsForCompetition: builder.query({
                query: (competitionId) => `/competitions/competition/${competitionId}/events`,
                providesTags: [eventTag],
                transformResponse: (response) => {
                    console.log('response', response)
                    return response['matches']
                }
            }),
            fetchMatchById: builder.query({
                query: (eventId) => `/matches/match/${eventId}`,
                providesTags: [eventTag],
                transformResponse: (response) => {
                    store.dispatch(matchLoaded(response))
                    return response
                }
            }),
        })
    }
})

export const {
    useFetchAllEventsQuery,
    useFetchMatchesForTeamQuery,
    useFetchEventsForCompetitionQuery,
    useFetchMatchByIdQuery,
} = eventApiSlice
