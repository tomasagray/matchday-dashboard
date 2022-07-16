import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react"
import properties from "./properties"

const {baseUrl} = properties

// cache invalidation tags
export const eventTag = 'Event'
export const videoSourceTag = 'VideoSource'
export const competitionTag = 'Competition'
export const teamTag = 'Team'
export const dataSourceTag = 'DataSource'
export const dataSourcePluginTag = 'DataSourcePlugin'
export const fileServerPluginTag = 'FileServerPlugin'
export const fileServerUserTag = 'FileServerUser'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({baseUrl}),
    tagTypes: [
        eventTag,
        competitionTag,
        teamTag,
        dataSourceTag,
        dataSourcePluginTag,
        fileServerPluginTag,
        fileServerUserTag
    ],
    endpoints: () => ({})
})
