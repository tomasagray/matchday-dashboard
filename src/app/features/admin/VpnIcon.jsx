import React from "react";
import {SmallSpinner} from "../../components/Spinner";

export const VpnIcon = (props) => {

    let {isConnected, isInFlight, vpnServer} = props

    if (isInFlight) {
        return (
            <div className="Vpn-icon">
                <SmallSpinner size={'24px'}/>
            </div>
        )
    }

    return (
        <div className="Vpn-icon">
            {
                <div className={"icon " + (isConnected ? 'connected' : '')}>
                    <img alt="Connected" src="/img/icon/vpn/vpn_32.png"/>
                    {
                        isConnected ? 'Connected' : 'Disconnected'
                    }
                </div>
            }
            <span className="Vpn-server">
                {vpnServer}
            </span>
        </div>
    )
}