import React, {useEffect} from "react";
import {useFetchCompetitionByIdQuery} from "../competitions/competitionApiSlice";
import {useFetchTeamByIdQuery} from "../teams/teamApiSlice";
import {getToastMessage} from "../../app/utils";
import {toast} from "react-toastify";
import {CenteredSpinner} from "../../components/Spinner";
import CompetitionTile from "../competitions/CompetitionTile";
import TeamTile from "../teams/TeamTile";

export const FindMoreContainer = (props) => {

    let {competitionId, homeTeamId, awayTeamId} = props

    // hooks
    const {
        data: competition,
        isLoading: isCompetitionLoading,
        isSuccess: isCompetitionSuccess,
        isError: isCompetitionError,
        error: competitionError
    } = useFetchCompetitionByIdQuery(competitionId, {skip: competitionId === undefined})
    const {
        data: homeTeam,
        isLoading: isHomeTeamLoading,
        isSuccess: isHomeTeamSuccess,
        isError: isHomeTeamError,
        error: homeTeamError
    } = useFetchTeamByIdQuery(homeTeamId, {skip: homeTeamId === undefined})
    const {
        data: awayTeam,
        isLoading: isAwayTeamLoading,
        isSuccess: isAwayTeamSuccess,
        isError: isAwayTeamError,
        error: awayTeamError,
    } = useFetchTeamByIdQuery(awayTeamId, {skip: awayTeamId === undefined})

    // toast messages
    useEffect(() => {
        if (isCompetitionError) {
            let msg = 'Failed loading competition data: ' + getToastMessage(competitionError)
            toast.error(msg)
        }
        if (isHomeTeamError) {
            let msg = 'Failed loading team data: ' + getToastMessage(homeTeamError)
            toast.error(msg);
        }
        if (isAwayTeamError) {
            let msg = 'Failed loading team data: ' + getToastMessage(awayTeamError)
            toast.error(msg)
        }
    }, [
        awayTeamError,
        competitionError,
        homeTeamError,
        isAwayTeamError,
        isCompetitionError,
        isHomeTeamError
    ])

    // components
    let competitionTile = isCompetitionSuccess ?
        <CompetitionTile competition={competition} key={competitionId} /> :
        null
    let homeTeamTile = isHomeTeamSuccess ?
        <TeamTile team={homeTeam} key={homeTeamId} /> :
        null
    let awayTeamTile = isAwayTeamSuccess ?
        <TeamTile team={awayTeam} key={awayTeamId} /> :
        null
    let tiles = [competitionTile, homeTeamTile, awayTeamTile]

    return (
        <div className="Find-more-container">
            <h3>Find more</h3>
            <div className="Find-more-items">
                {
                    isCompetitionLoading || isHomeTeamLoading || isAwayTeamLoading ?
                        <CenteredSpinner /> :
                        tiles
                }
            </div>
        </div>
    )
}
