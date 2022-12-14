import {apiSlice, competitionTag, eventTag} from "./apiSlice";
import store from "../../app/store";
import {matchAdapter, matchLoaded, matchSlice} from "../matchSlice";
import {JsonHeaders} from "../../app/constants";

const getNormalizedEvents = (response) => {
    // todo - handle highlights, other types?
    let {matches, _links: links} = response
    if (matches && matches.length > 0) {
        store.dispatch(matchSlice.actions.matchesLoaded(matches))
        let normalized = matchAdapter.setMany(matchAdapter.getInitialState(), matches)
        return {
            ...normalized,
            next: links?.next?.href
        }
    }
}

export const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchAllEvents: builder.query({
                query: (url = null, page = 0, size = 16) => {
                    if (url !== null) {
                        return {url}
                    }
                    return {
                        url: `/events?page=${page}&size=${size}`,
                    }
                },
                providesTags: [eventTag],
                transformResponse: (response) => {
                    return getNormalizedEvents(response)
                },
            }),
            fetchMatchesForTeam: builder.query({
                query: (teamId) => `/teams/team/${teamId}/matches`,
                providesTags: [eventTag],
                transformResponse: (response) => {
                    // TODO: standardize data shape - use matchAdapter, etc.
                    let {_embedded: embedded} = response
                    if (embedded) {
                        return getNormalizedEvents(embedded)
                    }
                },
            }),
            fetchEventsForCompetition: builder.query({
                query: (competitionId) => `/competitions/competition/${competitionId}/events`,
                providesTags: [eventTag],
                transformResponse: (response) => {
                    return getNormalizedEvents(response)
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
            updateMatch: builder.mutation({
                query: match => ({
                    url: '/matches/match/update',
                    method: 'PATCH',
                    headers: JsonHeaders,
                    body: match,
                }),
                invalidatesTags: [eventTag],
            }),
            deleteMatch: builder.mutation({
                query: matchId => ({
                    url: `/matches/match/${matchId}/delete`,
                    method: 'DELETE',
                }),
                invalidatesTags: [eventTag, competitionTag],
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
    useUpdateMatchMutation,
    useDeleteMatchMutation,
} = eventApiSlice
