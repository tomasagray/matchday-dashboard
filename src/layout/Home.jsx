import React, {useEffect} from "react";
import ContentBar from "../components/ContentBar";
import {useFetchAllEventsQuery} from "../features/events/eventApiSlice";
import {useFetchAllCompetitionsQuery} from "../features/competitions/competitionApiSlice";
import {useFetchAllTeamsQuery} from "../features/teams/teamApiSlice";
import {Spinner} from "../components/Spinner";
import EventTile from "../features/events/EventTile";
import CompetitionTile from "../features/competitions/CompetitionTile";
import TeamTile from "../features/teams/TeamTile";
import {toast} from "react-toastify";


export const Home = () => {

    const spinnerStyle = {
        margin: '3rem',
        overflow: 'revert',
        height: '10vh',
        display: 'flex',
        alignItems: 'center',
    }
    const spinner =
        <div style={spinnerStyle}>
            <Spinner text='' size={'32px'}/>
        </div>

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
    const events =
        isEventsLoading ?
            [spinner] :
            isEventsSuccess ?
                Object.values(eventsData.entities)
                    .map(event => <EventTile event={event} />) :
                null
    const competitions =
        isCompetitionsLoading ?
            [spinner] :
            isCompetitionsSuccess ?
                Object.values(competitionsData.entities)
                    .map(competition => <CompetitionTile competition={competition} />) :
                null
    const teams =
        isTeamsLoading ?
            [spinner] :
            isTeamsSuccess ?
                Object.values(teamsData.entities)
                    .map(team => <TeamTile team={team} />) :
                null

    // toast messages
    useEffect(() => {
        if (isEventsError) {
            let msg = eventsError.data ?? eventsError.error
            toast.error('Failed to load Events: ' + msg)
        }
        if (isCompetitionsError) {
            let msg = competitionsError.data ?? competitionsError.error
            toast.error('Failed to load Competitions: ' + msg)
        }
        if (isTeamsError) {
            let msg = teamsError.data ?? teamsError.error
            toast.error('Failed to load Teams: ' + msg)
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
            <ContentBar title="Recent" items={events}/>
            <ContentBar title="Top Competitions" items={competitions}/>
            <ContentBar title="Top Teams" items={teams}/>
        </div>
    );
}
