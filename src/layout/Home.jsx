import React from "react";
import ContentBar from "../components/ContentBar";
import {useFetchAllEventsQuery} from "../features/events/eventApiSlice";
import {useFetchAllCompetitionsQuery} from "../features/competitions/competitionApiSlice";
import {useFetchAllTeamsQuery} from "../features/teams/teamApiSlice";
import {Spinner} from "../components/Spinner";
import EventTile from "../features/events/EventTile";
import CompetitionTile from "../features/competitions/CompetitionTile";
import TeamTile from "../features/teams/TeamTile";


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

    const {data: eventsData, isLoading: isEventsLoading} = useFetchAllEventsQuery()
    const {data: competitionsData, isLoading: isCompetitionsLoading} = useFetchAllCompetitionsQuery()
    const {data: teamsData, isLoading: isTeamsLoading} = useFetchAllTeamsQuery()

    const events =
        isEventsLoading ?
            [spinner] :
            Object.values(eventsData.entities).map(event => <EventTile event={event} />)
    const competitions =
        isCompetitionsLoading ?
            [spinner] :
            Object.values(competitionsData.entities).map(competition => <CompetitionTile competition={competition} />)
    const teams =
        isTeamsLoading ?
            [spinner] :
            Object.values(teamsData.entities).map(team => <TeamTile team={team} />)

    return (
        <div className="Content-container Home-container">
            <ContentBar title="Recent" items={events}/>
            <ContentBar title="Top Competitions" items={competitions}/>
            <ContentBar title="Top Teams" items={teams}/>
        </div>
    );
}
