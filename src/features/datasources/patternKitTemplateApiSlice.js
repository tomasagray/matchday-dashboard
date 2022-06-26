import {apiSlice} from "../../app/apiSlice";

export const patternKitTemplateApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return {
            getAllTemplates: builder.query({
                query: () => '/pattern-kit-templates/all',
                transformResponse(result) {
                    let {_embedded: embedded} = result
                    let {templates} = embedded
                    return templates
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
