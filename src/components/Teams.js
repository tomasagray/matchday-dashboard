import React, {useContext, useEffect, useState} from "react";
import GridList from "./GridList";
import {Preferences} from "../Preferences";
import DataManager from "./DataManager";

const dataManager = new DataManager();

export default function Teams(props) {

    let preferences = useContext(Preferences);
    let teamsUrl = preferences.url.teams;
    let [teams, setTeams] = useState();

    useEffect(() => {
        dataManager.fetchTeamTiles(teamsUrl).then(teams => setTeams(teams));
    }, [teamsUrl]);

    return (
        <GridList items={teams}/>
    );
}
