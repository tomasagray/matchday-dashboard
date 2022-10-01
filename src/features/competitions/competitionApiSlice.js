import {apiSlice, competitionTag, eventTag, teamTag} from "../../app/apiSlice";
import {
    allCompetitionsLoaded,
    competitionAdapter,
    competitionLoaded,
    updateArtworkCollection
} from "./competitionSlice";
import store from "../../app/store";
import {teamAdapter, teamsLoaded} from "../teams/teamSlice";
import {JsonHeaders} from "../../app/constants";


export const competitionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            fetchAllCompetitions: builder.query({
                query: () => '/competitions',
                providesTags: [competitionTag],
                transformResponse: (response) => {
                    let {_embedded} = response
                    if (_embedded) {
                        let {competitions} = _embedded
                        store.dispatch(allCompetitionsLoaded(competitions))
                        return competitionAdapter.setAll(competitionAdapter.getInitialState(), competitions)
                    }
                },
            }),
            fetchCompetitionById: builder.query({
                query: (competitionId) => `/competitions/competition/${competitionId}`,
                providesTags: [competitionTag],
                transformResponse: (response) => {
                    store.dispatch(competitionLoaded(response))
                    return response
                },
            }),
            fetchTeamsForCompetition: builder.query({
                query: (competitionId) => `/competitions/competition/${competitionId}/teams`,
                providesTags: [teamTag],
                transformResponse: (response) => {
                    let {_embedded} = response
                    if (_embedded) {
                        let {teams} = _embedded
                        store.dispatch(teamsLoaded(teams))
                        return teamAdapter.setAll(teamAdapter.getInitialState(), teams)
                    }
                }
            }),
            updateCompetition: builder.mutation({
                query: (competition) =>
                    ({
                        url: `/competitions/competition/update`,
                        method: 'PATCH',
                        headers: JsonHeaders,
                        body: competition,
                    }),
                invalidatesTags: [competitionTag, eventTag]
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
        })
    }
})

export const {
    useFetchAllCompetitionsQuery,
    useFetchCompetitionByIdQuery,
    useFetchTeamsForCompetitionQuery,
    useUpdateCompetitionMutation,
    useAddCompetitionEmblemMutation,
    useAddCompetitionFanartMutation,
    useDeleteCompetitionEmblemMutation,
    useDeleteCompetitionFanartMutation,
} = competitionApiSlice
