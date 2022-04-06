import {Route, useRouteMatch} from "react-router-dom";
import ContentBar from "../../components/ContentBar";
import {useEffect, useState} from "react";
import DataManager from "../../components/DataManager";

const dataManager = new DataManager();

export default function TeamDetail(props) {
    let matcher = useRouteMatch();

    return (
        <>
            <Route path={`${matcher.path}:id`} children={<Data team={props.location.team}/>}/>
        </>
    );
};

function Data(props) {

    let links = props.team._links;

    let [matches, setMatches] = useState();
    // let [competitions, setCompetitions] = useState();

    let matchesUrl = links.events.href;
    useEffect(() => {
        dataManager.fetchEventTiles(matchesUrl).then(matches => setMatches(matches));
    }, [matchesUrl]);

    // let competitionsUrl = links.competitions.href;
    // useEffect(() => {
    //     dataManager.fetchCompetitionTiles(competitionsUrl).then(competitions => setCompetitions(competitions));
    // }, [competitionsUrl]);

    let emblemUrl = links.emblem.href;
    return (
        <>
            <div className="Content-container">
                <div className="Detail-header">
                    <img src={emblemUrl} alt={props.team.name} className="Detail-poster"/>
                    <h1 className="Detail-title">{props.team.name}</h1>
                </div>
                <ContentBar title={"Most recent matches"} items={matches}/>
                <div className="Team-competitions">
                    {/*<h2 className="Content-bar-title">Competing in</h2>*/} {/*<GridList items={competitions}/>*/}
                </div>
            </div>
        </>
    );
}
