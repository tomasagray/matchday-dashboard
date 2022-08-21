import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useFetchCompetitionByIdQuery, useFetchTeamsForCompetitionQuery} from "./competitionApiSlice";
import {CenteredSpinner, FillSpinner} from "../../components/Spinner";
import ContentBar from "../../components/ContentBar";
import {useFetchEventsForCompetitionQuery} from "../events/eventApiSlice";
import EventTile from "../events/EventTile";
import TeamTile from "../teams/TeamTile";
import Select from "../../components/controls/Select";
import {Option} from "../../components/controls/Option";
import {EditButton} from "../../components/controls/EditButton";
import {toast} from "react-toastify";
import {getToastMessage} from "../../app/utils";

export const CompetitionDetails = () => {

    const onClickEditButton = (e) => {
        e.preventDefault()
        console.log('edit')
        // todo - add competition edit modal
    }

    const params = useParams()
    const {competitionId} = params

    // hooks
    const {
        data: competition,
        isLoading: isCompetitionLoading,
        isSuccess: isCompetitionSuccess,
        isError: isCompetitionError,
        error: competitionError
    } = useFetchCompetitionByIdQuery(competitionId)
    const {
        data: teams,
        isLoading: isTeamsLoading,
        isSuccess: isTeamsSuccess,
        isError: isTeamsError,
        error: teamsError
    } = useFetchTeamsForCompetitionQuery(competitionId)
    const {
        data: events,
        isLoading: isEventsLoading,
        isError: isEventsError,
        error: eventsError
    } = useFetchEventsForCompetitionQuery(competitionId)

    // toast messages
    useEffect(() => {
        if (isCompetitionError) {
            let msg = `Failed to load Competition data for: ${competitionId}` + getToastMessage(competitionError)
            toast.error(msg)
        }
        if (isTeamsError) {
            let msg = 'Failed to load Teams: ' + getToastMessage(teamsError)
            toast.error(msg)
        }
        if (isEventsError) {
            let msg = 'Failed to load Events data: ' + getToastMessage(eventsError)
            toast.error(msg)
        }
    }, [
        competitionId,
        isCompetitionError,
        competitionError,
        isEventsError,
        eventsError,
        isTeamsError,
        teamsError])

    // components
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
                                    <CenteredSpinner /> :
                                    <ContentBar title="Most recent events" items={eventTiles}/>
                            }
                            <div className="Competition-teams-container">
                                <h2 className="Content-bar-title">Teams</h2>
                                {
                                    isTeamsLoading ?
                                        <CenteredSpinner /> :
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
