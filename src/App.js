import './style/App.css';
import './style/main.scss';

import React, {useContext} from "react";
import {BrowserRouter as Router} from "react-router-dom";

import HeaderNav from './components/HeaderNav';
import SideNav from "./components/SideNav";
import ContentStage from "./components/ContentStage";
import {Preferences} from "./Preferences";


export default function App() {
    const prefs = useContext(Preferences);
    // todo: pre-fetch initial data before rest of app loads
    // fetchBaseRoutes(prefs);


    return (
        <Preferences.Provider value={prefs}>
            <div className="App">
                <Router> <HeaderNav/>
                    <div className="Scroll-wrapper">
                        <SideNav/> <ContentStage/>
                    </div>
                </Router>
            </div>
        </Preferences.Provider>
    );
}

/*async function fetchBaseRoutes(prefs) {
     await axios.get(prefs.url.baseUrl).then(result => {
        let links = result.data._links;

        prefs.url.events = links.events;
        prefs.url.matches = links.matches;
        prefs.url.highlights = links.highlights;
        prefs.url.competitions = links.competitions;
        prefs.url.teams = links.teams;
    });
}*/
