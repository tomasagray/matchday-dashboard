import {apiSlice, dataSourceTag} from "../../app/apiSlice";
import store from "../../app/store";
import {JsonHeaders} from "../../app/constants";
import {allDataSourcesLoaded, dataSourceAdapter, dataSourcesLoaded} from "./dataSourceSlice";

let initialState = dataSourceAdapter.getInitialState()

export const dataSourceApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return {
            getAllDataSources: builder.query({
                query: () => '/data-sources/all',
                transformResponse: (response) => {
                    let {_embedded} = response
                    let {data_source} = _embedded
                    store.dispatch(allDataSourcesLoaded(data_source))
                    return dataSourceAdapter.setAll(initialState, data_source)
                },
                providesTags: (result) =>
                    result.ids.map(dataSourceId => ({
                        type: dataSourceTag,
                        id: dataSourceId
                    }))
            }),
            getDataSourcesForPlugin: builder.query({
                query: (pluginId) => ({url: `/data-sources/plugin/${pluginId}`}),
                transformResponse: (response) => {
                    let {_embedded} = response
                    let {data_source} = _embedded
                    store.dispatch(dataSourcesLoaded(data_source))
                    return dataSourceAdapter.setMany(initialState, data_source)
                },
                providesTags: (result) =>
                    result.ids.map(dataSourceId => ({
                        type: dataSourceTag,
                        id: dataSourceId
                    }))
            }),
            addDataSource: builder.mutation({
                query: ({dataSource}) => ({
                    url: '/data-sources/add-data-source',
                    method: 'POST',
                    headers: JsonHeaders,
                    body: {dataSource},
                }),
                invalidatesTags: [dataSourceTag]
            }),
            updateDataSource: builder.mutation({
                query: dataSource => ({
                    url: `/data-sources/data-source/${dataSource.dataSourceId}/update`,
                    method: 'PATCH',
                    headers: JsonHeaders,
                    body: dataSource,
                }),
                invalidatesTags: (result, error, arg) => [
                    {type: dataSourceTag, id: arg.dataSourceId}
                ]
            }),
        }
    }
})

export const selectAllDataSourcesResult = dataSourceApiSlice.endpoints.getAllDataSources.select()
export const selectDataSourcesForPluginResult =
    pluginId => dataSourceApiSlice.endpoints.getDataSourcesForPlugin.select(pluginId)

export const {
    useGetAllDataSourcesQuery,
    useGetDataSourcesForPluginQuery,
    useAddDataSourceMutation,
    useUpdateDataSourceMutation,
} = dataSourceApiSlice
