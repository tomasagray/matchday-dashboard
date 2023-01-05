import {configureStore} from "@reduxjs/toolkit";
import eventsReducer from "./slices/matchSlice";
import videoSourceReducer from "./slices/videoSourceSlice";
import competitionReducer from "./slices/competitionSlice";
import teamReducer from "./slices/teamSlice";
import dataSourceReducer from "./slices/dataSourceSlice";
import dataSourcePluginReducer from "./slices/dataSourcePluginSlice";
import patternKitReducer from "./slices/patternKitSlice";
import fileServerPluginReducer from "./slices/fileServerPluginSlice";
import fileServerUsersReducer from "./slices/fileServerUserSlice";
import settingsReducer from "./slices/settingsSlice";
import {apiSlice} from "./slices/api/apiSlice";

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
        settings: settingsReducer,
        [apiSlice['reducerPath']]: apiSlice['reducer']
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice['middleware'])
})
