import {apiSlice} from "./apiSlice";
import {JsonHeaders} from "../../constants";


export const videoStreamApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchVideoPlaylist: builder.query({
                query: (url) => url,
            }),
            killStreamsForSource: builder.mutation({
                query: ({videoSourceId}) => ({
                    url: `/video/stream/${videoSourceId}/kill-streams`,
                    headers: JsonHeaders,
                    method: 'POST',
                }),
            }),
            deleteStreamsForSource: builder.mutation({
                query: ({videoSourceId}) => ({
                    url: `/video/stream/${videoSourceId}/delete-streams`,
                    headers: JsonHeaders,
                    method: 'DELETE',
                }),
            }),
            downloadStream: builder.mutation({
                query: url => ({
                    url,
                    headers: JsonHeaders,
                    method: 'POST',
                })
            }),
            killStream: builder.mutation({
                query: ({videoFileId}) => ({
                    url: `/video/stream/${videoFileId}/kill-stream`,
                    headers: JsonHeaders,
                    method: 'POST',
                }),
            }),
            deleteStream: builder.mutation({
                query: ({videoFileId}) => ({
                    url: `/video/stream/${videoFileId}/delete-stream`,
                    headers: JsonHeaders,
                    method: 'DELETE',
                }),
            }),
        })
    }
})

export const {
    useFetchVideoPlaylistQuery,
    useKillStreamsForSourceMutation,
    useDeleteStreamsForSourceMutation,
    useDownloadStreamMutation,
    useKillStreamMutation,
    useDeleteStreamMutation,
} = videoStreamApiSlice