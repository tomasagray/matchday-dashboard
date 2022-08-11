import '../style/App.css';
import '../style/main.scss';
import React from "react";
import {HeaderNav} from '../layout/HeaderNav';
import {SideNav} from "../layout/SideNav";
import {ContentStage} from "../layout/ContentStage";
import "react-toastify/dist/ReactToastify.min.css";
import {ToastContainer} from "react-toastify";


export default function App() {

    return (
        <div className="App">
            <HeaderNav/>
            <div className="Scroll-wrapper">
                <SideNav/>
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
