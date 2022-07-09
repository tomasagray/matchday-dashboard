import EventTile from "../features/events/EventTile";
import React from "react";
import {Preferences} from "./preferences";
import axios from "axios";
import TeamTile from "../features/teams/TeamTile";
import CompetitionTile from "../features/competitions/CompetitionTile";

// todo: Make a singleton
class DataManager {

// todo - extract tile creation, make this data-agnostic
    async fetchEventTiles(url) {
        return axios.get(url)
            .then((result) => {
                let matches = result.data.matches;
                if (matches !== undefined) {
                    return matches.map(event =>
                        <EventTile key={event.eventId} event={event}/>
                    );
                }
            }, reason => {
                // todo - handle data errors
                this.error('Error fetching events data:', reason);
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
                this.error('Could not fetch competition data from:', url, reason);
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
                this.error('Error fetching teams data:', reason);
            });
    }

    async fetchDataSourcePlugins(url) {
        console.log("Fetching DataSourcePluginsList from: ", url);
        return axios.get(url)
            .then(result => {
                return result.data._embedded;
            }, reason => {
                this.error("Could not fetch data source plugins from: " + url, reason);
            })
    }

    error(...reasons) {
        console.log(reasons);
    }
}

DataManager.contextType = Preferences;
export default DataManager;
