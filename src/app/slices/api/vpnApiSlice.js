import {apiSlice, infoTag, vpnStatusTag} from "./apiSlice";

export const vpnApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            connectVpn: builder.mutation({
                query: () => ({
                    url: '/admin/vpn/start',
                    method: 'POST'
                }),
                invalidatesTags: [vpnStatusTag, infoTag]
            }),
            reconnectVpn: builder.mutation({
                query: () => ({
                    url: '/admin/vpn/restart',
                    method: 'POST'
                }),
                invalidatesTags: [vpnStatusTag, infoTag]
            }),
            disconnectVpn: builder.mutation({
                query: () => ({
                    url: '/admin/vpn/stop',
                    method: 'POST'
                }),
                invalidatesTags: [vpnStatusTag, infoTag]
            })
        })
    }
})

export const {
    useConnectVpnMutation,
    useReconnectVpnMutation,
    useDisconnectVpnMutation,
} = vpnApiSlice