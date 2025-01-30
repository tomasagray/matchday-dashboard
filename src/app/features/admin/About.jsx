import React, {useState} from "react";
import {useAppInfoQuery} from "../../slices/api/adminApiSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";
import properties from "../../properties";
import {VpnControl} from "./VpnControl";
import {StompSessionProvider} from "react-stomp-hooks";
import {setBackgroundImage} from "../../utils";


export const About = () => {

    const version = properties.version
    const baseUrl = properties.baseUrl
    const {
        data,
        isLoading,
        isSuccess,
        error,
    } = useAppInfoQuery()
    let [ipAddress, setIpAddress] = useState('?.?.?.?')

    setBackgroundImage('none')
    return (
        <StompSessionProvider url={properties.websocketUrl}>
            <h1>About</h1>
            <div className="About-description">
                <img src="/img/logo/logo_64.png" alt="Matchday"/>
                <p>
                    <strong style={{color: '#999'}}>
                        Matchday
                    </strong> <br/>
                    A simple content gathering service.
                </p>
            </div>
            {
                isLoading ?
                    <CenteredSpinner/> :
                    isSuccess ?
                        <div>
                            <table className="About-table">
                                <tbody>
                                <tr>
                                    <td>Dashboard version</td>
                                    <td>{version}</td>
                                </tr>
                                <tr>
                                    <td>Server version</td>
                                    <td>{data.version}</td>
                                </tr>
                                <tr>
                                    <td>PID</td>
                                    <td>{data.pid}</td>
                                </tr>
                                <tr>
                                    <td>System</td>
                                    <td>{data.system}</td>
                                </tr>
                                <tr>
                                    <td>Connected to</td>
                                    <td>{baseUrl}</td>
                                </tr>
                                <tr>
                                    <td>Server IP Address</td>
                                    <td>{ipAddress}</td>
                                </tr>
                                <tr>
                                    <td>VPN status</td>
                                    <td>
                                        <VpnControl onUpdate={setIpAddress}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div> :
                        <ErrorMessage code={error.status}>{error.error}</ErrorMessage>
            }
        </StompSessionProvider>
    )
}