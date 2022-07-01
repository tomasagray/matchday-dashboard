import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react"
import properties from "./properties"

const {baseUrl} = properties

// cache invalidation tags
export const dataSourceTag = 'DataSource'
export const dataSourcePluginTag = 'DataSourcePlugin'
export const fileServerPluginTag = 'FileServerPlugin'
export const fileServerUserTag = 'FileServerUser'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    tagTypes: [dataSourceTag, dataSourcePluginTag, fileServerPluginTag, fileServerUserTag],
    endpoints: () => ({})
})
