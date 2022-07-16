import React from "react";
import {useParams} from "react-router-dom";
import {useFetchCompetitionByIdQuery, useFetchTeamsForCompetitionQuery} from "./competitionApiSlice";
import {FillSpinner, Spinner} from "../../components/Spinner";
import ContentBar from "../../components/ContentBar";
import {useFetchEventsForCompetitionQuery} from "../events/eventApiSlice";
import EventTile from "../events/EventTile";
import TeamTile from "../teams/TeamTile";
import Select from "../../components/controls/Select";
import {Option} from "../../components/controls/Option";
import {EditButton} from "../../components/controls/EditButton";

export const CompetitionDetails = () => {

    const onClickEditButton = (e) => {
        e.preventDefault()
        console.log('edit')
    }

    const params = useParams()
    const {competitionId} = params
    const {
        data: competition,
        isLoading: isCompetitionLoading,
        isSuccess: isCompetitionSuccess
    } = useFetchCompetitionByIdQuery(competitionId)
    const {
        data: teams,
        isLoading: isTeamsLoading,
        isSuccess: isTeamsSuccess
    } = useFetchTeamsForCompetitionQuery(competitionId)
    const {
        data: events,
        isLoading: isEventsLoading,
    } = useFetchEventsForCompetitionQuery(competitionId)

    let eventTiles = events?.map(event => <EventTile event={event} /> ) ?? []
    let teamTiles =
        isTeamsSuccess ?
            Object.values(teams.entities).map(
                team => <TeamTile team={team} key={team.id} />
            ) : []

    return (
        <>
            {
                isCompetitionLoading ?
                    <FillSpinner/> :
                    isCompetitionSuccess ?
                        <div>
                            <h1 className="Detail-title">{competition.name}</h1>
                            <div className="Detail-header">
                                <img src={competition['_links']['emblem'].href} alt={competition.name}
                                     className="Detail-poster"/>
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
                            {
                                isEventsLoading ?
                                    <Spinner/> :
                                    <ContentBar title="Most recent events" items={eventTiles}/>
                            }
                            <div className="Competition-teams-container">
                                <h2 className="Content-bar-title">Teams</h2>
                                {
                                    isTeamsLoading ?
                                        <Spinner/> :
                                        <div className="Entity-display">
                                            {teamTiles}
                                        </div>
                                }
                            </div>
                        </div> :
                        null
            }
        </>
    )
}
