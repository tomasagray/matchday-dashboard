import React, {useEffect} from "react";
import ContentBar from "../components/ContentBar";
import {useFetchAllEventsQuery} from "../slices/api/eventApiSlice";
import {useFetchAllCompetitionsQuery} from "../slices/api/competitionApiSlice";
import {useFetchAllTeamsQuery} from "../slices/api/teamApiSlice";
import {CenteredSpinner} from "../components/Spinner";
import EventTile from "../features/events/EventTile";
import CompetitionTile from "../features/competitions/CompetitionTile";
import TeamTile from "../features/teams/TeamTile";
import {toast} from "react-toastify";
import {getToastMessage} from "../utils";
import {EmptyMessage} from "../components/EmptyMessage";
import {Link} from "react-router-dom";
import {ErrorMessage} from "../components/ErrorMessage";

export const Home = () => {

    // hooks
    const {
        data: eventsData,
        isLoading: isEventsLoading,
        isSuccess: isEventsSuccess,
        isError: isEventsError,
        error: eventsError
    } = useFetchAllEventsQuery()
    const {
        data: competitionsData,
        isLoading: isCompetitionsLoading,
        isSuccess: isCompetitionsSuccess,
        isError: isCompetitionsError,
        error: competitionsError
    } = useFetchAllCompetitionsQuery()
    const {
        data: teamsData,
        isLoading: isTeamsLoading,
        isSuccess: isTeamsSuccess,
        isError: isTeamsError,
        error: teamsError
    } = useFetchAllTeamsQuery()

    // item lists
    let eventTiles = (isEventsSuccess && eventsData) ?
        Object.values(eventsData.entities).map(event => <EventTile event={event}/>) :
        []
    if (eventTiles.length >= 16) {
        eventTiles.push(
            <Link to={"/events"}>
                <div style={{padding: '1.5rem'}}>
                    <div className="More-button">
                        <img src={'/img/icon/more/more_32.png'} alt="More..."/>
                    </div>
                </div>
            </Link>
        )
    }
    let eventsList =
        isEventsError ?
            <ErrorMessage>Could not load events data.</ErrorMessage> :
            isEventsLoading ?
                <CenteredSpinner/> :
                isEventsSuccess && eventsData ?
                    <ContentBar title="Latest Events" items={eventTiles}/> :
                    <EmptyMessage noun="events"/>

    let competitionTiles = (isCompetitionsSuccess && competitionsData) ?
        Object.values(competitionsData.entities)
            .map(competition => <CompetitionTile competition={competition}/>) :
        []
    let competitionsList =
        isCompetitionsError ?
            <ErrorMessage>Could not load competitions data.</ErrorMessage> :
            isCompetitionsLoading ?
                <CenteredSpinner/> :
                isCompetitionsSuccess && competitionsData ?
                    <ContentBar title="Competitions" items={competitionTiles}/> :
                    <EmptyMessage noun="competitions"/>;

    let teamTiles = (isTeamsSuccess && teamsData) ?
        Object.values(teamsData.entities)
            .map(team => <TeamTile team={team}/>) :
        []
    if (teamTiles.length >= 16) {
        teamTiles.push(
            <Link to={"/teams"}>
                <div style={{padding: '1.5rem'}}>
                    <div className="More-button">
                        <img src={'/img/icon/more/more_32.png'} alt="More..."/>
                    </div>
                </div>
            </Link>
        )
    }
    let teamsList =
        isTeamsError ?
            <ErrorMessage>Could not load teams data.</ErrorMessage> :
            isTeamsLoading ?
                <CenteredSpinner/> :
                isTeamsSuccess && teamsData ?
                    <ContentBar title="Teams" items={teamTiles}/> :
                    <EmptyMessage noun="teams"/>

    // toast messages
    useEffect(() => {
        if (isEventsError) {
            let msg = 'Failed to load Events: ' + getToastMessage(eventsError)
            toast.error(msg)
        }
        if (isCompetitionsError) {
            let msg = 'Failed to load Competitions: ' + getToastMessage(competitionsError)
            toast.error(msg)
        }
        if (isTeamsError) {
            let msg = 'Failed to load Teams: ' + getToastMessage(teamsError)
            toast.error(msg)
        }
    }, [
        isEventsError,
        eventsError,
        isCompetitionsError,
        competitionsError,
        isTeamsError,
        teamsError
    ])

    return (
        <div className="Content-container Home-container">
            {eventsList}
            {competitionsList}
            {teamsList}
        </div>
    );
}
