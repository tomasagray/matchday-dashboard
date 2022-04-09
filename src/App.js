import './style/App.css';
import './style/main.scss';

import React, {useContext} from "react";
import {BrowserRouter as Router} from "react-router-dom";

import HeaderNav from './layout/HeaderNav';
import SideNav from "./layout/SideNav";
import ContentStage from "./layout/ContentStage";
import {Preferences} from "./Preferences";


export default function App() {
    const prefs = useContext(Preferences);

    return (
        <Preferences.Provider value={prefs}>
            <div className="App">
                <Router>
                    <HeaderNav/>
                    <div className="Scroll-wrapper">
                        <SideNav/>
                        <ContentStage/>
                    </div>
                </Router>
            </div>
        </Preferences.Provider>
    );
}
