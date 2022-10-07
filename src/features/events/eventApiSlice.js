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
                    // todo - handle highlights, other types?
                    let {matches} = response
                    if (matches && matches.length > 0) {
                        store.dispatch(matchSlice.actions.matchesLoaded(matches));
                        return matchAdapter.setAll(matchAdapter.getInitialState(), matches)
                    }
                },
            }),
            fetchMatchesForTeam: builder.query({
                query: (teamId) => `/teams/team/${teamId}/matches`,
                providesTags: [eventTag],
                transformResponse: (response) => {
                    let {_embedded: embedded} = response
                    if (embedded) {
                        return embedded['matches'];
                    }
                },
            }),
            fetchEventsForCompetition: builder.query({
                query: (competitionId) => `/competitions/competition/${competitionId}/events`,
                providesTags: [eventTag],
                transformResponse: (response) => {
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
            refreshMatchArtwork: builder.mutation({
                query: matchId => ({
                    url: `/matches/match/${matchId}/artwork/refresh`,
                    method: 'POST',
                }),
                invalidatesTags: [eventTag],
            }),
        })
    }
})

export const {
    useFetchAllEventsQuery,
    useFetchMatchesForTeamQuery,
    useFetchEventsForCompetitionQuery,
    useFetchMatchByIdQuery,
    useRefreshMatchArtworkMutation,
} = eventApiSlice
