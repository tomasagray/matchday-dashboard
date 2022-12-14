import {apiSlice, videoSourceTag} from "./apiSlice";
import {
    initialState,
    videoSourceAdapter,
    videoSourcesLoaded
} from "../videoSourceSlice";
import store from "../../store";
import {JsonHeaders} from "../../constants";

export const videoSourceApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchVideoSourcesForEvent: builder.query({
                query: (eventId) => `/events/event/${eventId}/video`,
                providesTags: [videoSourceTag],
                transformResponse: (response) => {
                    let sources = response['_embedded']['video-sources']
                    store.dispatch(videoSourcesLoaded(sources))
                    return videoSourceAdapter.setAll(initialState, sources)
                }
            }),
            fetchVideoPlaylist: builder.query({
                query: (url) => url,
            }),
            killStreamsForSource: builder.mutation({
                query: ({eventId, videoSourceId}) => ({
                    url: `/events/event/${eventId}/video/stream/${videoSourceId}/kill-streams`,
                    headers: JsonHeaders,
                    method: 'POST',
                }),
            }),
            deleteStreamsForSource: builder.mutation({
                query: ({eventId, videoSourceId}) => ({
                    url: `/events/event/${eventId}/video/stream/${videoSourceId}/delete-streams`,
                    headers: JsonHeaders,
                    method: 'DELETE',
                }),
            }),
            killStream: builder.mutation({
                query: ({eventId, videoFileId}) => ({
                    url: `/events/event/${eventId}/video/stream/${videoFileId}/kill-stream`,
                    headers: JsonHeaders,
                    method: 'POST',
                }),
            }),
            deleteStream: builder.mutation({
                query: ({eventId, videoFileId}) => ({
                    url: `/events/event/${eventId}/video/stream/${videoFileId}/delete-stream`,
                    headers: JsonHeaders,
                    method: 'DELETE',
                }),
            }),
        })
    }
})

export const {
    useFetchVideoSourcesForEventQuery,
    useFetchVideoPlaylistQuery,
    useKillStreamsForSourceMutation,
    useDeleteStreamsForSourceMutation,
    useKillStreamMutation,
    useDeleteStreamMutation,
} = videoSourceApiSlice
