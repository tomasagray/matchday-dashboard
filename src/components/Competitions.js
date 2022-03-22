import React, {useContext, useEffect, useState} from "react";
import DataManager from "./DataManager";
import GridList from "./GridList";
import {Preferences} from "../Preferences";

const dataManager = new DataManager();

export default function Competitions(props) {

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
