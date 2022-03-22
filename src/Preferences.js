// create app prefs
import React from "react";

export const baseUrl = 'http://localhost:8080';

export const Preferences = React.createContext({
    url: {
        baseUrl: baseUrl,
        events: baseUrl + '/events',
        matches: baseUrl + '/matches',
        highlights: baseUrl + '/highlights',
        competitions: baseUrl + '/competitions',
        teams: baseUrl + '/teams',
    },
});
