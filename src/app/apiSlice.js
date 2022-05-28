import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react"
import properties from "./properties"

const {baseUrl} = properties
export const dataSourceTag = 'DataSource'
export const dataSourcePluginTag = 'DataSourcePlugin'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    tagTypes: [dataSourceTag, dataSourcePluginTag],
    endpoints: () => ({})
})
