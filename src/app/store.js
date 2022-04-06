import {configureStore} from "@reduxjs/toolkit";
import eventsReducer from "../features/events/eventsSlice"
import datasourcesReducer from "../features/datasources/dataSourcesSlice"
import {apiSlice} from "./apiSlice";


export default configureStore({
    reducer: {
        events: eventsReducer,
        datasources: datasourcesReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})
