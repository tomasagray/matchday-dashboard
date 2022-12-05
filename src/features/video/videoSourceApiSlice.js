import {apiSlice, videoSourceTag} from "../../app/apiSlice";
import {
    initialState,
    videoSourceAdapter,
    videoSourcesLoaded
} from "./videoSourceSlice";
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
                query: (url) => url,
            }),
        })
    }
})

export const {
    useFetchVideoSourcesForEventQuery,
    useFetchVideoPlaylistQuery,
} = videoSourceApiSlice
