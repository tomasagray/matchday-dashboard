import React, {useEffect} from "react";
import ContentBar from "../components/ContentBar";
import {useFetchAllEventsQuery} from "../features/events/eventApiSlice";
import {useFetchAllCompetitionsQuery} from "../features/competitions/competitionApiSlice";
import {useFetchAllTeamsQuery} from "../features/teams/teamApiSlice";
import {CenteredSpinner} from "../components/Spinner";
import EventTile from "../features/events/EventTile";
import CompetitionTile from "../features/competitions/CompetitionTile";
import TeamTile from "../features/teams/TeamTile";
import {toast} from "react-toastify";
import {getToastMessage} from "../app/utils";
import {Link} from "react-router-dom";


export const Home = () => {

    const EmptyMessage = (props) => {

        let {noun} = props
        const style = {
            margin: '2rem 0',
            color: '#ccc',
        }
        return (
            <>
                <p style={style}>
                    There are currently no <strong>{noun}</strong>.
                    Try refreshing the <Link to="/data-sources">data sources</Link>.
                </p>
            </>
        )
    }

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
    let events =
        isEventsLoading ?
           <CenteredSpinner /> :
           isEventsSuccess && eventsData ?
                <ContentBar title="Recent" items={
                    Object.values(eventsData.entities)
                        .map(event => <EventTile event={event} />)}
                /> :
                <EmptyMessage noun="events"/>

    let competitions =
        isCompetitionsLoading ?
            <CenteredSpinner /> :
            isCompetitionsSuccess && competitionsData ?
                <ContentBar title="Competitions" items={
                    Object.values(competitionsData.entities)
                        .map(competition => <CompetitionTile competition={competition}/>)
                } /> :
                <EmptyMessage noun="competitions" />

    let teams =
        isTeamsLoading ?
            <CenteredSpinner /> :
            isTeamsSuccess && teamsData ?
                <ContentBar title="Teams" items={
                    Object.values(teamsData.entities)
                        .map(team => <TeamTile team={team}/>)
                } /> :
                <EmptyMessage noun="teams" />

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
            {events}
            {competitions}
            {teams}
        </div>
    );
}
