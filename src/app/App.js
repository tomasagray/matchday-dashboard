import '../style/App.css';
import '../style/main.scss';
import React, {useContext} from "react";
import {HeaderNav} from '../layout/HeaderNav';
import {SideNav} from "../layout/SideNav";
import {ContentStage} from "../layout/ContentStage";
import {Preferences} from "./preferences";


export default function App() {

    const prefs = useContext(Preferences)

    return (
        <Preferences.Provider value={prefs}>
            <div className="App">
                <HeaderNav/>
                <div className="Scroll-wrapper">
                    <SideNav/>
                    <ContentStage/>
                </div>
            </div>
        </Preferences.Provider>
    )
}
