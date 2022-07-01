import {configureStore} from "@reduxjs/toolkit";
import dataSourceReducer from "../features/datasources/dataSourceSlice"
import dataSourcePluginReducer from "../features/datasource-plugins/dataSourcePluginSlice"
import patternKitReducer from "../features/datasources/patternKitSlice"
import fileServerPluginReducer from "../features/file-servers/fileServerPluginSlice"
import fileServerUsersReducer from "../features/file-servers/fileServerUserSlice"
import {apiSlice} from "./apiSlice";

export default configureStore({
    reducer: {
        // events: eventsReducer,
        dataSources: dataSourceReducer,
        dataSourcePlugins: dataSourcePluginReducer,
        patternKits: patternKitReducer,
        fileServerPlugins: fileServerPluginReducer,
        fileServerUsers: fileServerUsersReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})
