import {apiSlice, competitionTag, eventTag, teamTag} from "./apiSlice";
import {updateArtworkCollection} from "../teamSlice";
import store from "../../store";
import {infiniteQueryOptions, JsonHeaders} from "../../constants";


export const getNormalizedTeams = (response) => {
    let {_embedded: embedded, _links: links} = response
    if (embedded) {
        let {teams} = embedded
        let next = links?.next
        return {
            teams,
            next: next?.href,
        }
    }
    return {}
}

export const teamApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchAllTeams: builder.infiniteQuery({
            infiniteQueryOptions,
            query: ({pageParam}) => `/teams?page=${pageParam}`,
            providesTags: [teamTag],
            transformResponse: (response) => getNormalizedTeams(response)
        }),
        fetchTeamById: builder.query({
            query: (teamId) => `/teams/team/${teamId}`,
            providesTags: [teamTag],
        }),
        fetchCompetitionsForTeam: builder.query({
            query: (teamId) => `/teams/team/${teamId}/competitions`,
            providesTags: [competitionTag],
            transformResponse: (response) => {
                let {_embedded} = response
                if (_embedded) {
                    let {competitions} = _embedded
                    return competitions
                }
                return []
            }
        }),
        addNewTeam: builder.mutation({
            query: (team) => ({
                url: '/teams/team/add',
                method: 'POST',
                headers: JsonHeaders,
                body: team,
            }),
            invalidatesTags: [teamTag, eventTag],
            transformResponse: response => getNormalizedTeams(response)
        }),
        updateTeam: builder.mutation({
            query: (team) => ({
                url: `/teams/team/update`,
                method: 'PATCH',
                headers: JsonHeaders,
                body: team,
            }),
            invalidatesTags: [teamTag, eventTag],
        }),
        addTeamEmblem: builder.mutation({
            query: emblem => ({
                url: `/teams/team/${emblem.entityId}/emblem/add`,
                method: 'POST',
                body: emblem.formData,
            }),
            invalidatesTags: [teamTag],
        }),
        addTeamFanart: builder.mutation({
            query: fanart => ({
                url: `/teams/team/${fanart.entityId}/fanart/add`,
                method: 'POST',
                body: fanart.formData,
            }),
            invalidatesTags: [teamTag],
        }),
        deleteTeamEmblem: builder.mutation({
            query: req => ({
                url: `/teams/team/${req.entityId}/emblem/${req.artwork.id}/remove`,
                method: 'DELETE',
            }),
            invalidatesTags: [teamTag],
            transformResponse(response) {
                store.dispatch(updateArtworkCollection({collection: response}))
                return response
            }
        }),
        deleteTeamFanart: builder.mutation({
            query: req => ({
                url: `/teams/team/${req.entityId}/fanart/${req.artwork.id}/remove`,
                method: 'DELETE',
            }),
            invalidatesTags: [teamTag],
            transformResponse(response) {
                store.dispatch(updateArtworkCollection({collection: response}))
                return response
            }
        }),
        deleteTeam: builder.mutation({
            query: teamId => ({
                url: `/teams/team/${teamId}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: [teamTag],
            transformResponse: teamId => {
                console.log('team deleted', teamId)
                // TODO: handle further?
                return teamId
            },
        }),
    })
})

export const {
    useFetchAllTeamsInfiniteQuery,
    useFetchTeamByIdQuery,
    useFetchCompetitionsForTeamQuery,
    useAddNewTeamMutation,
    useUpdateTeamMutation,
    useAddTeamEmblemMutation,
    useAddTeamFanartMutation,
    useDeleteTeamEmblemMutation,
    useDeleteTeamFanartMutation,
    useDeleteTeamMutation,
} = teamApiSlice
