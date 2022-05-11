import React, {useContext, useEffect, useState} from "react";
import GridList from "../../components/GridList";
import {Preferences} from "../../Preferences";
import DataManager from "../../components/DataManager";

const dataManager = new DataManager();

export const Teams = (props) => {

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
