import {configureStore} from "@reduxjs/toolkit";
import dataSourceReducer from "../features/datasources/dataSourceSlice"
import dataSourcePluginReducer from "../features/datasource-plugins/dataSourcePluginSlice"
import {apiSlice} from "./apiSlice";

export default configureStore({
    reducer: {
        // events: eventsReducer,
        dataSources: dataSourceReducer,
        dataSourcePlugins: dataSourcePluginReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})
