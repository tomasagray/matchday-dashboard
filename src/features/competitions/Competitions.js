import React, {useContext, useEffect, useState} from "react";
import DataManager from "../../app/DataManager";
import GridList from "../../components/GridList";
import {Preferences} from "../../app/preferences";

const dataManager = new DataManager();

export const Competitions = (props) => {

    let preferences = useContext(Preferences);
    let competitionUrl = preferences.url.competitions;
    let [competitions, setCompetitions] = useState();

    useEffect(() => {
        dataManager.fetchCompetitionTiles(competitionUrl).then(competitions => setCompetitions(competitions));
    }, [competitionUrl]);

    return (
        <GridList items={competitions}/>
    );
}
