import React, {useEffect} from "react";
import ContentBar from "../components/ContentBar";
import {useFetchAllEventsInfiniteQuery} from "../slices/api/eventApiSlice";
import {useFetchAllCompetitionsQuery} from "../slices/api/competitionApiSlice";
import {useFetchAllTeamsInfiniteQuery} from "../slices/api/teamApiSlice";
import {CenteredSpinner} from "../components/Spinner";
import CompetitionTile from "../features/competitions/CompetitionTile";
import TeamTile from "../features/teams/TeamTile";
import {toast} from "react-toastify";
import {getToastMessage, setBackgroundImage} from "../utils";
import {EmptyMessage} from "../components/EmptyMessage";
import {Link} from "react-router-dom";
import {ErrorMessage} from "../components/ErrorMessage";
import {MoreButton} from "../components/MoreButton";
import EventTile from "../features/events/EventTile";

export const Home = () => {

    // hooks
    const {
        data: eventsData,
        isLoading: isEventsLoading,
        isSuccess: isEventsSuccess,
        isError: isEventsError,
        error: eventsError
    } = useFetchAllEventsInfiniteQuery()
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
    } = useFetchAllTeamsInfiniteQuery()

    // item lists
    let eventTiles = (isEventsSuccess && eventsData) ?
        Object.values(eventsData?.pages[0].matches).map(event => <EventTile event={event}/>) :
        []
    if (eventTiles.length >= 16) {
        eventTiles.push(
            <Link to={"/events"}>
                <MoreButton/>
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
        Object.values(competitionsData)
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
        Object.values(teamsData?.pages[0].teams)
            .map(team => <TeamTile team={team}/>) :
        []
    if (teamTiles.length >= 16) {
        teamTiles.push(
            <Link to={"/teams"}>
                <MoreButton/>
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

    setBackgroundImage('none')
    return (
        <div className="Content-container Home-container">
            {eventsList}
            {competitionsList}
            {teamsList}
        </div>
    );
}
