import {apiSlice, competitionTag, eventTag, teamTag} from "./apiSlice";
import {updateArtworkCollection} from "../competitionSlice";
import store from "../../store";
import {JsonHeaders} from "../../constants";
import {getNormalizedTeams} from "./teamApiSlice";


export const competitionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchAllCompetitions: builder.query({
            query: () => '/competitions',
            providesTags: [competitionTag],
            transformResponse: (response) => {
                let {_embedded} = response
                if (_embedded) {
                    let {competitions} = _embedded
                    return competitions
                }
                return []
            },
        }),
        fetchCompetitionById: builder.query({
            query: (competitionId) => `/competitions/competition/${competitionId}`,
            providesTags: [competitionTag],
        }),
        fetchTeamsForCompetition: builder.query({
            query: (competitionId) => `/competitions/competition/${competitionId}/teams`,
            providesTags: [teamTag],
            transformResponse: (response) => getNormalizedTeams(response)
        }),
        addNewCompetition: builder.mutation({
            query: (competition) => ({
                url: '/competitions/competition/add',
                method: 'POST',
                headers: JsonHeaders,
                body: competition,
            }),
            invalidatesTags: [competitionTag, eventTag],
        }),
        updateCompetition: builder.mutation({
            query: (competition) =>
                ({
                    url: `/competitions/competition/update`,
                    method: 'PATCH',
                    headers: JsonHeaders,
                    body: competition,
                }),
            invalidatesTags: [competitionTag, eventTag],
        }),
        addCompetitionEmblem: builder.mutation({
            query: emblem => ({
                url: `/competitions/competition/${emblem.entityId}/emblem/add`,
                method: 'POST',
                body: emblem.formData,
            }),
            invalidatesTags: [competitionTag]
        }),
        addCompetitionFanart: builder.mutation({
            query: fanart => ({
                url: `/competitions/competition/${fanart.entityId}/fanart/add`,
                method: 'POST',
                body: fanart.formData,
            }),
            invalidatesTags: [competitionTag],
        }),
        deleteCompetitionEmblem: builder.mutation({
            query: req => ({
                url: `/competitions/competition/${req.entityId}/emblem/${req.artwork.id}/remove`,
                method: 'DELETE',
            }),
            invalidatesTags: [competitionTag],
            transformResponse(response) {
                store.dispatch(updateArtworkCollection({collection: response}))
                return response
            }
        }),
        deleteCompetitionFanart: builder.mutation({
            query: req => ({
                url: `/competitions/competition/${req.entityId}/fanart/${req.artwork.id}/remove`,
                method: 'DELETE',
            }),
            invalidatesTags: [competitionTag],
            transformResponse(response) {
                store.dispatch(updateArtworkCollection({collection: response}))
                return response
            }
        }),
        deleteCompetition: builder.mutation({
            query: competitionId => ({
                url: `/competitions/competition/${competitionId}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: [competitionTag, eventTag],
        }),
    })
})

export const {
    useFetchAllCompetitionsQuery,
    useFetchCompetitionByIdQuery,
    useFetchTeamsForCompetitionQuery,
    useAddNewCompetitionMutation,
    useUpdateCompetitionMutation,
    useAddCompetitionEmblemMutation,
    useAddCompetitionFanartMutation,
    useDeleteCompetitionEmblemMutation,
    useDeleteCompetitionFanartMutation,
    useDeleteCompetitionMutation,
} = competitionApiSlice
