import './style/App.css';
import './style/main.scss';
import React, {useEffect, useState} from "react";
import {HeaderNav} from './layout/HeaderNav';
import {SideNav} from "./layout/SideNav";
import {ContentStage} from "./layout/ContentStage";
import "react-toastify/dist/ReactToastify.min.css";
import {ToastContainer} from "react-toastify";
import {BackgroundContainer} from "./layout/BackgroundContainer";
import Cookies from "universal-cookie";
import {serverAddressCookie} from "./constants";


export default function App() {

    const cookies = new Cookies()
    const serverCookie = cookies.get(serverAddressCookie)

    // state
    let [isLoggedIn, setIsLoggedIn] = useState(false)
    useEffect(() => {
        if (serverCookie) {
            setIsLoggedIn(true)
        } else if (window.location.pathname !== '/login') {
            window.location = '/login'
        }
    }, [serverCookie, setIsLoggedIn, isLoggedIn])

    return (
        <div className="App">
            {
                isLoggedIn ?
                    <>
                        <BackgroundContainer/>
                        <HeaderNav/>
                        <SideNav/>
                    </> :
                    null    // hide interface
            }
            <div className="Scroll-wrapper">
                <ContentStage/>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                rtl={false}
                theme="dark"
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}
