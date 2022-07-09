import React from "react"
import properties from "./properties"

const {baseUrl} = properties

export const Preferences = React.createContext({
    url: {
        baseUrl: baseUrl,
        events: baseUrl + '/events',
        matches: baseUrl + '/matches',
        highlights: baseUrl + '/highlights',
        competitions: baseUrl + '/competitions',
        teams: baseUrl + '/teams',
        dataSourcePlugins: baseUrl + '/data-sources/plugin/all',
    },
});
