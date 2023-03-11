import {apiSlice, restorePointTag, settingsTag} from "./apiSlice";
import {JsonHeaders} from "../../constants";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => {
    return ({
      fetchSettings: builder.query({
        query: () => '/settings',
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
      }),
      generateSanityReport: builder.mutation({
        query: () => ({
          url: '/sanity-report/generate/json',
          method: 'GET',
        }),
      }),
      getAllRestorePoints: builder.query({
        query: () => '/system/restore-points/all',
        providesTags: [restorePointTag],
        transformResponse: response => {
          let {_embedded: embedded} = response
          if (embedded) {
            let {restore_points} = embedded
            return restore_points
          }
          return []
        }
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
    })
  }
})

export const {
  useFetchSettingsQuery,
  useUpdateSettingsMutation,
  useAppInfoQuery,
  useGenerateSanityReportMutation,
  useGetAllRestorePointsQuery,
  useCreateRestorePointMutation,
  useRestoreSystemMutation,
} = adminApiSlice