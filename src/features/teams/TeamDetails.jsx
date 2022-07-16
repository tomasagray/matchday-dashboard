import ContentBar from "../../components/ContentBar";
import {useParams} from "react-router-dom";
import {useFetchCompetitionsForTeamQuery, useFetchTeamByIdQuery} from "./teamApiSlice";
import {FillSpinner, Spinner} from "../../components/Spinner";
import {useFetchMatchesForTeamQuery} from "../events/eventApiSlice";
import EventTile from "../events/EventTile";
import CompetitionTile from "../competitions/CompetitionTile";
import {EditButton} from "../../components/controls/EditButton";
import Select from "../../components/controls/Select";
import {Option} from "../../components/controls/Option";
import React from "react";


export const TeamDetails = () => {

    const onClickEditButton = (e) => {
        e.preventDefault()
        console.log('edit team')
    }

    const params = useParams()
    const {teamId} = params
    const {data: team, isLoading: isTeamLoading} = useFetchTeamByIdQuery(teamId)
    const {data: matches} = useFetchMatchesForTeamQuery(teamId)
    const {data: competitions, isLoading: isCompetitionsLoading} = useFetchCompetitionsForTeamQuery(teamId)

    let matchTiles = matches?.map(match => <EventTile event={match} key={match['eventId']} />) ?? []
    let competitionTiles =
        isCompetitionsLoading ?
            <Spinner text=''/> :
            Object.values(competitions.entities).map(
                competition => <CompetitionTile competition={competition} key={competition.id} />
            )

    return (
        <>
            {
                isTeamLoading ?
                    <FillSpinner /> :
                    <div className="Content-container">
                        <h2 className="Detail-title">{team.name}</h2>
                        <div className="Detail-header">
                            <img src={team['_links']['emblem'].href} alt={team.name} className="Detail-poster"/>
                            <div className="Detail-data">
                                <EditButton onClick={onClickEditButton} />
                                <Select id="language-selector" placeholder="Default language">
                                    {/* todo - get languages from server */}
                                    <Option name="default" value="default">Default language</Option>
                                    <Option name="en" value="en-Us">English</Option>
                                    <Option name="es" value="es">Spanish</Option>
                                    <Option name="it" value="it">Italian</Option>
                                    <Option name="fr" value="fr">French</Option>
                                </Select>
                            </div>
                        </div>
                        <ContentBar title={"Most recent matches"} items={matchTiles}/>
                        <h3>Competing in</h3>
                        <div className="Entity-display">
                            {competitionTiles}
                        </div>
                    </div>
            }
        </>
    );
}
