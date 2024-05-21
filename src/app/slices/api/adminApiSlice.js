import {apiSlice, infoTag, logLevelTag, restorePointTag, settingsTag, tagTypes} from "./apiSlice";
import {JsonHeaders} from "../../constants";

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchSettings: builder.query({
                query: () => '/settings',
                transformResponse: (response) => response['settings'],
                providesTags: [settingsTag],
            }),
            updateSettings: builder.mutation({
                query: (settings) => ({
                    url: '/settings/update',
                    method: 'POST',
                    headers: JsonHeaders,
                    body: settings,
                }),
                invalidatesTags: [settingsTag],
            }),
            appInfo: builder.query({
                query: () => '/info',
                providesTags: [infoTag],
            }),
            generateSanityReport: builder.mutation({
                query: () => ({
                    url: '/sanity-report/generate/json',
                    method: 'GET',
                }),
            }),
            attemptAutoHeal: builder.mutation({
                query: (report) => ({
                    url: '/sanity-report/auto-heal',
                    method: 'POST',
                    headers: JsonHeaders,
                    body: report,
                })
            }),
            getAllRestorePoints: builder.query({
                query: () => '/system/restore-points/all',
                transformResponse: response => {
                    let {_embedded: embedded} = response
                    if (embedded) {
                        let {restore_points} = embedded
                        return restore_points
                    }
                    return []
                },
                providesTags: [restorePointTag],
            }),
            createRestorePoint: builder.mutation({
                query: () => ({
                    url: '/system/restore-points/create',
                    method: 'POST'
                }),
                invalidatesTags: [restorePointTag],
            }),
            restoreSystem: builder.mutation({
                query: (restorePointId) => ({
                    url: '/system/restore-points/restore',
                    method: 'POST',
                    body: JSON.stringify(restorePointId),
                    headers: JsonHeaders,
                }),
                invalidatesTags: [restorePointTag],
            }),
            deleteRestorePoint: builder.mutation({
                query: (restorePointId) => ({
                    url: `/system/restore-points/${restorePointId}/delete`,
                    method: 'DELETE',
                }),
                invalidatesTags: [restorePointTag],
            }),
            dehydrateSystem: builder.query({
                query: () => '/system/dehydrate'
            }),
            rehydrateSystem: builder.mutation({
                query: (systemImage) => ({
                    url: '/system/rehydrate',
                    method: 'POST',
                    headers: JsonHeaders,
                    body: systemImage,
                }),
                invalidatesTags: [tagTypes],  // all tags
            }),
            getLogLevel: builder.query({
                query: () => '/actuator/loggers/self.me.matchday',
                providesTags: [logLevelTag],
            }),
            setLogLevel: builder.mutation({
                query: (level) => ({
                    url: '/actuator/loggers/self.me.matchday',
                    method: 'POST',
                    headers: JsonHeaders,
                    body: level,
                }),
                invalidatesTags: [logLevelTag],
            }),
        })
    }
})

export const {
    useFetchSettingsQuery,
    useUpdateSettingsMutation,
    useAppInfoQuery,
    useGenerateSanityReportMutation,
    useAttemptAutoHealMutation,
    useGetAllRestorePointsQuery,
    useCreateRestorePointMutation,
    useRestoreSystemMutation,
    useDeleteRestorePointMutation,
    useLazyDehydrateSystemQuery,
    useRehydrateSystemMutation,
    useGetLogLevelQuery,
    useSetLogLevelMutation,
} = adminApiSlice