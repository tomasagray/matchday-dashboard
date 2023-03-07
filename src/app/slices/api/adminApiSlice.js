import {apiSlice, settingsTag} from "./apiSlice";
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
    })
  }
})

export const {
  useFetchSettingsQuery,
  useUpdateSettingsMutation,
  useAppInfoQuery,
  useGenerateSanityReportMutation,
} = adminApiSlice