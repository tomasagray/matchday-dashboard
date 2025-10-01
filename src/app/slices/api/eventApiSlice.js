import {apiSlice, competitionTag, eventTag} from "./apiSlice";
import store from "../../store";
import {artworkRefreshed, matchAdapter, matchDeleted, matchLoaded, matchSlice} from "../matchSlice";
import {infiniteQueryOptions, JsonHeaders} from "../../constants";


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

const removeVideoFileIds = (event) => {
    return {
        ...event,
        fileSources: event.fileSources.map(source => {
            return {
                ...source,
                videoFilePacks: source.videoFilePacks.map(pack => {
                    // get a mutable copy
                    let uploadPack = JSON.parse(JSON.stringify(pack))
                    for (let partName in pack.videoFiles) {
                        if (pack.videoFiles.hasOwnProperty(partName)) {
                            uploadPack.videoFiles[partName].videoFileId = null
                        }
                    }
                    return uploadPack
                })
            }
        })
    }
}

export const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchAllEvents: builder.infiniteQuery({
            infiniteQueryOptions,
            query: ({pageParam}) => `/events?page=${pageParam}`,
            providesTags: [eventTag],
            transformResponse: (response) => getNormalizedEvents(response),
        }),
        fetchMatchesForTeam: builder.infiniteQuery({
            infiniteQueryOptions,
            query: ({queryArg, pageParam}) => `/teams/team/${queryArg}/matches?page=${pageParam}`,
            providesTags: [eventTag],
            transformResponse: (response) => getNormalizedEvents(response),
        }),
        fetchEventsForCompetition: builder.infiniteQuery({
            infiniteQueryOptions,
            query: ({queryArg, pageParam}) => `/competitions/competition/${queryArg}/events?page=${pageParam}`,
            providesTags: [eventTag],
            transformResponse: (response) => getNormalizedEvents(response)
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
            transformResponse: response => {
                let {_links: links} = response
                if (links) {
                    let {image} = links
                    store.dispatch(artworkRefreshed(image?.href))
                }
                return response
            },
        }),
        addMatch: builder.mutation({
            query: match => ({
                url: '/matches/match/add',
                method: 'POST',
                headers: JsonHeaders,
                body: removeVideoFileIds(match),
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
            transformResponse: matchId => {
                store.dispatch(matchDeleted(matchId))
                return matchId
            },
        }),
    })
})

export const {
    useFetchAllEventsInfiniteQuery,
    useFetchMatchesForTeamInfiniteQuery,
    useFetchEventsForCompetitionInfiniteQuery,
    useFetchMatchByIdQuery,
    useRefreshMatchArtworkMutation,
    useAddMatchMutation,
    useUpdateMatchMutation,
    useDeleteMatchMutation,
} = eventApiSlice
