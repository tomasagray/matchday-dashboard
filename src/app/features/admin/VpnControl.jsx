import {useConnectVpnMutation, useDisconnectVpnMutation, useReconnectVpnMutation} from "../../slices/api/vpnApiSlice";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {properties} from "../../properties";
import {VpnIcon} from "./VpnIcon";


export const VpnControl = (props) => {

    const {onUpdate} = props
    const stompClient = useStompClient()

    // handlers
    const onConnectVpn = async () => {
        console.log('connecting VPN...')
        await connectVpn()
        console.log('connected')
    }
    const onReconnectVpn = async () => {
        console.log('reconnecting VPN...')
        await reconnectVpn()
        console.log('reconnected')
    }
    const onDisconnectVpn = async () => {
        console.log('disconnecting VPN...')
        await disconnectVpn()
        console.log('disconnected')
    }

    // state
    let [connectionStatus, setConnectionStatus] = useState('')
    let [vpnServer, setVpnServer] = useState('')
    // request data...
    useEffect(() => {
        if (stompClient) {
            stompClient.publish({
                destination: properties.websocketRoot + '/subscribe/vpn-status',
            })
        }
    }, [stompClient])
    // ... receive data
    useSubscription(properties.websocketRoot + '/subscription/vpn-status', (msg) => {
        let status = JSON.parse(msg.body)
        onUpdate(status['ipAddress'])
        setConnectionStatus(status['connectionStatus'])
        setVpnServer(status['vpnServer'])
    })

    // hooks
    let [connectVpn, {
        isLoading: isVpnConnecting,
        isError: isConnectError,
        error: connectError
    }] = useConnectVpnMutation()
    let [reconnectVpn, {
        isLoading: isVpnReconnecting,
        isError: isReconnectError,
        error: reconnectError
    }] = useReconnectVpnMutation()
    let [disconnectVpn, {
        isLoading: isVpnDisconnecting,
        isError: isDisconnectError,
        error: disconnectError
    }] = useDisconnectVpnMutation()

    // toast messages
    useEffect(() => {
        if (isConnectError) {
            let msg = 'Error connecting VPN: ' + getToastMessage(connectError)
            toast.error(msg)
        }
        if (isReconnectError) {
            let msg = 'Error reconnecting VPN: ' + getToastMessage(reconnectError)
            toast.error(msg)
        }
        if (isDisconnectError) {
            let msg = 'Error disconnecting VPN: ' + getToastMessage(disconnectError)
            toast.error(msg)
        }

    }, [
        isConnectError, isReconnectError, isDisconnectError,
        connectError, reconnectError, disconnectError
    ])

    let isConnected = connectionStatus === 'CONNECTED'
    let isInFlight = connectionStatus === 'CONNECTING'
        || isVpnConnecting || isVpnReconnecting || isVpnDisconnecting

    return (
        <div className="Vpn-control">
            <VpnIcon
                isConnected={isConnected}
                isInFlight={isInFlight}
                vpnServer={vpnServer}
            />
            {
                isConnected ?
                    <>
                        <button className="Small-button" onClick={onReconnectVpn} disabled={isInFlight}>
                            Reconnect
                        </button>
                        <button className="Small-button" onClick={onDisconnectVpn} disabled={isInFlight}>
                            Disconnect
                        </button>
                    </> :
                    <button className="Small-button" onClick={onConnectVpn} disabled={isInFlight}>
                        Connect
                    </button>
            }
        </div>
    )
}