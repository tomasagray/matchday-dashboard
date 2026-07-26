import React from "react";
import {SmallSpinner} from "../../components/Spinner";

export const VpnIcon = (props) => {

    const VpnError = () => {
        return (<>
            <img alt="VPN connection error" src="/img/icon/error/error_32.png"/>
            <span style={{textAlign: 'center'}}>Connection error!</span>
        </>)
    }
    const VpnConnectionIcon = () => {
        return (<>
            <img alt="Connected" src="/img/icon/vpn/vpn_32.png"/>
            {
                isConnected ? 'Connected' : 'Disconnected'
            }
        </>)
    }

    // state
    let {isInFlight, isConnected, isError} = props


    if (isInFlight) {
        return (
            <div className="Vpn-icon">
                <SmallSpinner size={'32px'}/>
            </div>
        )
    }

    return (
        <div className="Vpn-icon">
            <div className={"icon " + (isConnected ? 'connected' : '')}>
                {
                    isError ? <VpnError/> : <VpnConnectionIcon/>
                }
            </div>
        </div>
    )
}