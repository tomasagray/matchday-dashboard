import '../style/App.css';
import '../style/main.scss';
import React from "react";
import {HeaderNav} from '../layout/HeaderNav';
import {SideNav} from "../layout/SideNav";
import {ContentStage} from "../layout/ContentStage";

export default function App() {

    return (
        <div className="App">
            <HeaderNav/>
            <div className="Scroll-wrapper">
                <SideNav/>
                <ContentStage/>
            </div>
        </div>
    )
}
