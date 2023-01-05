import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react"
import properties from "../../properties"

const {baseUrl} = properties

// cache invalidation tags
export const artworkTag = 'Artwork'
export const eventTag = 'Event'
export const competitionTag = 'Competition'
export const dataSourceTag = 'DataSource'
export const dataSourcePluginTag = 'DataSourcePlugin'
export const fileServerPluginTag = 'FileServerPlugin'
export const fileServerUserTag = 'FileServerUser'
export const settingsTag = 'Settings'
export const teamTag = 'Team'
export const videoSourceTag = 'VideoSource'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({baseUrl}),
    tagTypes: [
        artworkTag,
        eventTag,
        competitionTag,
        dataSourceTag,
        dataSourcePluginTag,
        fileServerPluginTag,
        fileServerUserTag,
        teamTag
    ],
    endpoints: () => ({})
})
