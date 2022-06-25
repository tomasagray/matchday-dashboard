import {apiSlice} from "../../app/apiSlice";
import {createSelector} from "@reduxjs/toolkit";

export const patternKitTemplateApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return {
            getAllTemplates: builder.query({
                query: () => '/pattern-kit-templates/all',
                transformResponse(result) {
                    let {_embedded: embedded} = result
                    return embedded.templates
                }
            }),
            getTemplateForType: builder.query({
                query: (type) => `/pattern-kit-templates/type/${type}`,
            })
        }
    }
})

export const {
    useGetAllTemplatesQuery,
    useGetTemplateForTypeQuery
} = patternKitTemplateApiSlice

export const selectTemplateForTypeResult =
    (state, type) => patternKitTemplateApiSlice.endpoints.getTemplateForType.select(type)

export const selectTemplateForType = createSelector(
    selectTemplateForTypeResult,
    result => {
        console.log('result', result)
        return result?.data ?? null
    }
)
