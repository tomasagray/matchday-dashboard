import {useConnectVpnMutation, useDisconnectVpnMutation, useReconnectVpnMutation} from "../../slices/api/vpnApiSlice";
import React, {useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {properties} from "../../properties";
import {VpnIcon} from "./VpnIcon";
import {useCaptureEnterPressed} from "../../hooks/useCaptureEnterPressed";
import {FloatingMenu} from "../../components/FloatingMenu";


export const VpnControl = (props) => {

    const validServerPattern = /^[A-z]{2}\d{1,6}$/g
    const {onUpdate} = props
    const stompClient = useStompClient()
    const menu = document.getElementById('Vpn-control')

    // handlers
    const validateVpnServer = server => server != null &&
        (server === '' || server.match(validServerPattern) !== null)
    const onConnectVpn = async () => {
        if (validateVpnServer(vpnServer)) {
            console.log('connecting VPN...', vpnServer);
            await connectVpn(vpnServer)
            console.log('VPN connected')
        } else toast.error("Invalid VPN server: " + vpnServer)

    }
    const onReconnectVpn = async () => {
        if (validateVpnServer(vpnServer)) {
            console.log('reconnecting VPN...', vpnServer);
            await reconnectVpn(vpnServer)
            console.log('VPN reconnected')
        } else toast.error("Invalid VPN server: " + vpnServer)
    }
    const onDisconnectVpn = async () => {
        console.log('disconnecting VPN...')
        await disconnectVpn()
        console.log('VPN disconnected')
    }
    const onServerInputFocus = () => setIsServerFocused(true)
    const onServerInputBlur = () => setIsServerFocused(false)
    const onServerTextChange = (e) => setVpnServer(e.target.value)
    const onClickOutsideButtonMenu = (e) => {
        if (menu !== e.target && !menu.contains(e.target))
            onHideButtonMenu()
    }
    const onShowButtonMenu = () => setIsButtonMenuHidden(false)
    const onHideButtonMenu = () => {
        if (document.activeElement !== vpnServerInputRef.current)
            setIsButtonMenuHidden(true)
    }

    // state
    let vpnServerInputRef = useRef(null)
    let [connectionStatus, setConnectionStatus] = useState('')
    let [vpnServer, setVpnServer] = useState('')
    let [isServerFocused, setIsServerFocused] = useState(false)
    let [isButtonMenuHidden, setIsButtonMenuHidden] = useState(true)

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
        onUpdate && onUpdate(status['ipAddress'])
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

    useCaptureEnterPressed({ref: vpnServerInputRef, action: onConnectVpn, isFocused: isServerFocused})

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

    const menuStyle = {
        top: '5rem',
        right: '5rem',
        minWidth: '300px',
        padding: '1.5rem',
        boxShadow: 'none',
        border: 'none',
        borderRadius: '0 0 10px 10px',
        backgroundColor: 'rgba(40, 40, 40, 0.8)',
    }

    return (
        <div id="Vpn-control"
             className="Vpn-control"
             onMouseEnter={onShowButtonMenu}
             onMouseLeave={onHideButtonMenu}>
            <VpnIcon
                isInFlight={isInFlight}
                isConnected={isConnected}
                isError={connectionStatus === 'ERROR'}
            />
            <input ref={vpnServerInputRef}
                   type="text" size={8}
                   className="Vpn-server"
                   value={vpnServer}
                   onChange={onServerTextChange}
                   onFocus={onServerInputFocus}
                   onBlur={onServerInputBlur}
            />
            <FloatingMenu style={menuStyle}
                          hidden={isButtonMenuHidden}
                          onClickOutside={onClickOutsideButtonMenu}>
                {
                    isConnected ?
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <button className="Small-button" onClick={onReconnectVpn} disabled={isInFlight}>
                                Reconnect
                            </button>
                            <button className="Small-button" onClick={onDisconnectVpn} disabled={isInFlight}>
                                Disconnect
                            </button>
                        </div> :
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button className="Small-button" onClick={onConnectVpn} disabled={isInFlight}>
                                Connect
                            </button>
                        </div>
                }
            </FloatingMenu>
        </div>
    )
}