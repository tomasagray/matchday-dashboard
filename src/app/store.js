import {configureStore} from "@reduxjs/toolkit";
import eventsReducer from "../features/events/eventsSlice"
import dataSourcesReducer from "../features/datasources/dataSourcesSlice"
import {apiSlice} from "./apiSlice";


export default configureStore({
    reducer: {
        events: eventsReducer,
        dataSources: dataSourcesReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})
