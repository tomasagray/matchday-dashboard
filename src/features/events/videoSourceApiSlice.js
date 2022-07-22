import {apiSlice, videoSourceTag} from "../../app/apiSlice";
import {initialState, videoSourceAdapter, videoSourcesLoaded} from "./videoSourceSlice";
import store from "../../app/store";


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
                query: (eventId, videoSrcId) =>
                    `/events/event/${eventId}/video/stream/${videoSrcId}/playlist.m3u8`,
                transformResponse: (response) => {
                    console.log('response for video src', response)
                    return response
                }
            }),
        })
    }
})

export const {
    useFetchVideoSourcesForEventQuery,
    useFetchVideoPlaylistQuery,
} = videoSourceApiSlice
