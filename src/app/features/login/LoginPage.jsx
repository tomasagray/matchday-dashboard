import React, {useState} from "react";
import Cookies from "universal-cookie/es6";
import {ServerConnect} from "./ServerConnect";
import {serverAddressCookie} from "../../constants";
import {Navigate} from "react-router-dom";

export const LoginPage = () => {

    const cookies = new Cookies()
    // handlers
    const onConnectToServer = (serverAddress) => {
        cookies.set(serverAddressCookie, serverAddress, {path: '/'})
        setServerCookie(cookies.get(serverAddressCookie))
        window.location = '/'
    }

    // state
    let [serverCookie, setServerCookie] = useState(cookies.get(serverAddressCookie))

    // components
    return (
        <div className="Login-container">
            <div className="Login-form-container">
                <img src={process.env.PUBLIC_URL + '/img/logo192.png'} alt="Matchday"/>
                <div className="Login-form">
                    {
                        serverCookie ?
                            <Navigate to="/" replace/> :
                            <ServerConnect onConnect={onConnectToServer}/>
                    }
                </div>
            </div>
        </div>
    )
}