import {apiSlice, settingsTag} from "./apiSlice";
import {JsonHeaders} from "../../constants";

export const settingsApiSlice = apiSlice.injectEndpoints({
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
    })
  }
})

export const {
  useFetchSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApiSlice