import ContentBar from "../../components/ContentBar";
import {useParams} from "react-router-dom";
import {useFetchCompetitionsForTeamQuery, useFetchTeamByIdQuery} from "./teamApiSlice";
import {CenteredSpinner, FillSpinner} from "../../components/Spinner";
import {useFetchMatchesForTeamQuery} from "../events/eventApiSlice";
import EventTile from "../events/EventTile";
import CompetitionTile from "../competitions/CompetitionTile";
import {EditButton} from "../../components/controls/EditButton";
import Select from "../../components/controls/Select";
import {Option} from "../../components/controls/Option";
import React, {useEffect} from "react";
import {getToastMessage} from "../../app/utils";
import {toast} from "react-toastify";
import {ErrorMessage} from "../../components/ErrorMessage";


export const TeamDetails = () => {

    const onClickEditButton = (e) => {
        e.preventDefault()
        console.log('edit team')
        // todo - edit teams modal
    }

    const params = useParams()
    const {teamId} = params

    // hooks
    const {
        data: team,
        isLoading: isTeamLoading,
        isSuccess: isTeamSuccess,
        isError: isTeamError,
        error: teamError
    } = useFetchTeamByIdQuery(teamId)
    const {
        data: matches,
        isLoading: isMatchesLoading,
        isSuccess: isMatchesSuccess,
        isError: isMatchesError,
        error: matchesError
    } = useFetchMatchesForTeamQuery(teamId)
    const {
        data: competitions, 
        isLoading: isCompetitionsLoading,
        isSuccess: isCompetitionsSuccess,
        isError: isCompetitionsError,
        error: competitionsError
    } = useFetchCompetitionsForTeamQuery(teamId)

    // toast messages
    useEffect(() => {
        if (isTeamError) {
            let msg = `Failed to load Team data for ${teamId}: ` + getToastMessage(teamError)
            toast.error(msg)
        }
        if (isCompetitionsError) {
            let msg = 'Failed to load Competitions: ' + getToastMessage(competitionsError)
            toast.error(msg)
        }
        if (isMatchesError) {
            let msg = 'Failed to load Matches: ' + getToastMessage(matchesError)
            toast.error(msg)
        }
    }, [
        teamId,
        isMatchesError,
        matchesError,
        isCompetitionsError,
        competitionsError,
        isTeamError,
        teamError
    ])

    // components
    let matchTiles =
            isMatchesSuccess ?
                matches.map(match => <EventTile event={match} key={match['eventId']} />) :
                []
    let competitionTiles =
        isCompetitionsLoading ?
            <CenteredSpinner /> :
            isCompetitionsSuccess ?
                Object.values(competitions.entities).map(
                    competition => <CompetitionTile competition={competition} key={competition.id} />
                ) :
                null

    return (
        <>
            {
                isTeamLoading ?
                    <FillSpinner /> :
                    isTeamSuccess ?
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

                            {
                                isMatchesLoading ?
                                    <CenteredSpinner /> :
                                    <ContentBar title={"Most recent matches"} items={matchTiles}/>
                            }

                            <h3>Competing in</h3>
                            <div className="Entity-display">
                                {competitionTiles}
                            </div>
                        </div> :
                        <ErrorMessage>Could not load Team data</ErrorMessage>
            }
        </>
    );
}
