import {apiSlice, competitionTag, eventTag} from "../../app/apiSlice";
import store from "../../app/store";
import {matchAdapter, matchLoaded, matchSlice} from "./matchSlice";
import {JsonHeaders} from "../../app/constants";

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
                    // todo - handle highlights, other types?
                    let {matches, _links: links} = response
                    console.log('response', response)
                    if (matches && matches.length > 0) {
                        store.dispatch(matchSlice.actions.matchesLoaded(matches))
                        let normalized = matchAdapter.setMany(matchAdapter.getInitialState(), matches)
                        return {
                            ...normalized,
                            next: links?.next?.href
                        }
                    }
                },
            }),
            fetchMatchesForTeam: builder.query({
                query: (teamId) => `/teams/team/${teamId}/matches`,
                providesTags: [eventTag],
                transformResponse: (response) => {
                    // TODO: standardize data shape - use matchAdapter, etc.
                    let {_embedded: embedded} = response
                    if (embedded) {
                        return embedded['matches']
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
