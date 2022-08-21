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
                    if (_embedded) {
                        let {dataSource} = _embedded
                        if (dataSource !== null) {
                            store.dispatch(dataSourcesLoaded(dataSource))
                            return dataSourceAdapter.setMany(initialState, dataSource)
                        }
                    }
                },
                providesTags: (result) =>
                    result?.ids?.map(dataSourceId => ({
                        type: dataSourceTag,
                        id: dataSourceId
                    })) ?? []
            }),
            addDataSource: builder.mutation({
                query: (dataSource) => ({
                    url: '/data-sources/data-source/add',
                    method: 'POST',
                    headers: JsonHeaders,
                    body: dataSource,
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
            deleteDataSource: builder.mutation({
                query: dataSourceId => ({
                    url: `/data-sources/data-source/${dataSourceId}/delete`,
                    method: 'DELETE',
                }),
                invalidatesTags: [dataSourceTag]
            })
        }
    }
})

export const {
    useGetDataSourcesForPluginQuery,
    useAddDataSourceMutation,
    useUpdateDataSourceMutation,
    useDeleteDataSourceMutation,
} = dataSourceApiSlice
