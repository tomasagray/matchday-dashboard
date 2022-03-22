import EventTile from "./EventTile";
import React from "react";
import {Preferences} from "../Preferences";
import axios from "axios";
import TeamTile from "./TeamTile";
import CompetitionTile from "./CompetitionTile";

// todo: Make a singleton
class DataManager {

    async fetchEventTiles(url) {
        return axios.get(url)
            .then((result) => {
                let data = result.data._embedded;
                if (data !== undefined) {
                    return data.events.map(event =>
                        <EventTile key={event.eventId} event={event}/>
                    );
                }
            }, reason => {
                // todo - handle data errors
                console.log('Error fetching events data:', reason);
            });
    }

    async fetchCompetitionTiles(url) {
        return axios.get(url)
            .then(result => {
                let data = result.data._embedded;
                if (data !== undefined) {
                    return data.competitions.map(competition =>
                        <CompetitionTile key={competition.id} competition={competition}/>
                    );
                }
            }, reason => {
                console.log('Could not fetch competition data from:', url, reason);
            });
    }

    async fetchTeamTiles(url) {
        return axios.get(url)
            .then(result => {
                let data = result.data._embedded;
                if (data !== undefined) {
                    return data.teams.map(team =>
                        <TeamTile key={team.teamId} team={team}/>
                    );
                }
            }, reason => {
                console.log('Error fetching teams data:', reason);
            });
    }
}

DataManager.contextType = Preferences;
export default DataManager;
