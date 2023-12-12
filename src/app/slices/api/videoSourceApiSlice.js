import {apiSlice, eventTag, videoSourceTag} from "./apiSlice";
import {initialState, videoSourceAdapter, videoSourcesLoaded} from "../videoSourceSlice";
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
            uploadVideoSource: builder.mutation({
                query: (req) => ({
                    url: `/events/event/${req.eventId}/video/stream/update`,
                    headers: JsonHeaders,
                    method: 'PATCH',
                    body: req.videoSource,
                }),
                invalidatesTags: [videoSourceTag, eventTag],
            }),
            deleteVideoSource: builder.mutation({
                query: (req) => ({
                    url: `/events/event/${req.eventId}/video/stream/${req.videoSourceId}/delete`,
                    method: 'DELETE',
                }),
                invalidatesTags: [videoSourceTag, eventTag]
            }),
        })
    }
})

export const {
    useFetchVideoSourcesForEventQuery,
    useUploadVideoSourceMutation,
    useDeleteVideoSourceMutation,
} = videoSourceApiSlice
