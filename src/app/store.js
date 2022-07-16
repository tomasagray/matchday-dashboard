import {configureStore} from "@reduxjs/toolkit";
import eventsReducer from "../features/events/matchSlice"
import videoSourceReducer from "../features/events/videoSourceSlice"
import competitionReducer from "../features/competitions/competitionSlice"
import teamReducer from "../features/teams/teamSlice"
import dataSourceReducer from "../features/datasources/dataSourceSlice"
import dataSourcePluginReducer from "../features/datasource-plugins/dataSourcePluginSlice"
import patternKitReducer from "../features/datasources/patternKitSlice"
import fileServerPluginReducer from "../features/file-servers/fileServerPluginSlice"
import fileServerUsersReducer from "../features/file-servers/fileServerUserSlice"
import {apiSlice} from "./apiSlice";

export default configureStore({
    reducer: {
        events: eventsReducer,
        videoSources: videoSourceReducer,
        competitions: competitionReducer,
        teams: teamReducer,
        dataSources: dataSourceReducer,
        dataSourcePlugins: dataSourcePluginReducer,
        patternKits: patternKitReducer,
        fileServerPlugins: fileServerPluginReducer,
        fileServerUsers: fileServerUsersReducer,
        [apiSlice['reducerPath']]: apiSlice['reducer']
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice['middleware'])
})
