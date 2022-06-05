import React, {useEffect, useState} from "react";
import DataManager from "../../app/DataManager";
import {Route, useMatch} from "react-router-dom";
import ContentBar from "../../components/ContentBar";
import GridList from "../../components/GridList";

export const CompetitionDetail = (props) => {
    let matcher = useMatch();

    // let history = useHistory();
    // console.log('history', history)
    let competition = null //history.location.competition;
    console.log('competition', competition);

    return (
        <>
            <Route path={`${matcher.path}:id`} children={<Data {...props} competition={props.location.competition}/>}/>
        </>
    );
};

const dataManager = new DataManager();

function Data() {
    let [events, setEvents] = useState();
    let [teams, setTeams] = useState();


    // let history = useHistory();
    // console.log('history', history)
    let competition = null //history.location.competition;
    // console.log('competition', competition);

    // get most recent events for competition
    let eventsUrl = null //competition._links.events.href;
    useEffect(() => {
        dataManager.fetchEventTiles(eventsUrl).then(events => setEvents(events))
    }, [eventsUrl]);

    // get teams for competition
    let teamsUrl = null //competition._links.teams.href;
    useEffect(() => {
        dataManager.fetchTeamTiles(teamsUrl).then(teams => setTeams(teams))
    }, [teamsUrl]);

    return (
        <div className="Content-container">
            <div className="Detail-header">
                <img src={''} alt={''} className="Detail-poster"/>
                <div className="Detail-data">
                    <h1 className="Detail-title">competition name</h1>
                    <select id="language-selector">
                        {/* todo - get languages from server */}
                        <option name="default" value="default">Default language</option>
                        <option name="en" value="en-Us">English</option>
                        <option name="es" value="es">Spanish</option>
                        <option name="it" value="it">Italian</option>
                        <option name="fr" value="fr">French</option>
                    </select>
                </div>
            </div>
            <ContentBar title="Most recent events" items={events}/>
            <div className="Competition-teams-container">
                <h2 className="Content-bar-title">Teams</h2>
                <GridList items={teams}/>
            </div>
        </div>
    );
}
