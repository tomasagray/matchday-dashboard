import React, {useContext, useEffect, useState} from "react";
import {Preferences} from "../Preferences";
import DataManager from "./DataManager";
import ContentBar from "./ContentBar";


const dataManager = new DataManager();

export default function Home(props) {

    const prefs = useContext(Preferences);
    let eventUrl = prefs.url.events;
    let competitionUrl = prefs.url.competitions;
    let teamUrl = prefs.url.teams;

    let [events, setEvents] = useState();
    let [competitions, setCompetitions] = useState();
    let [teams, setTeams] = useState();

    useEffect(() => {
        dataManager.fetchEventTiles(eventUrl).then(events => setEvents(events));
    }, [eventUrl]);

    useEffect(() => {
        dataManager.fetchCompetitionTiles(competitionUrl).then(competitions => setCompetitions(competitions));
    }, [competitionUrl]);

    useEffect(() => {
        dataManager.fetchTeamTiles(teamUrl).then(teams => setTeams(teams));
    }, [teamUrl]);

    return (
        <div className="Content-container Home-container">
            {/*Most recent events*/} <ContentBar title="Recent" items={events}/> {/*Most viewed competitions*/}
            <ContentBar title="Top Competitions" items={competitions}/> {/*Most viewed teams*/} <ContentBar
            title="Top Teams" items={teams}/>
        </div>
    );
}
