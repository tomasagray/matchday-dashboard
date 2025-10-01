import ContentBar from "../../components/ContentBar";
import {Link, useParams} from "react-router-dom";
import {useFetchCompetitionsForTeamQuery, useFetchTeamByIdQuery} from "../../slices/api/teamApiSlice";
import {CenteredSpinner, FillSpinner} from "../../components/Spinner";
import {useFetchMatchesForTeamInfiniteQuery} from "../../slices/api/eventApiSlice";
import EventTile from "../events/EventTile";
import CompetitionTile from "../competitions/CompetitionTile";
import {EditButton} from "../../components/controls/EditButton";
import React, {useEffect, useState} from "react";
import {getArtworkUrl, getToastMessage, setBackgroundImage} from "../../utils";
import {toast} from "react-toastify";
import {ErrorMessage} from "../../components/ErrorMessage";
import {SoftLoadImage} from "../../components/SoftLoadImage";
import {useDispatch} from "react-redux";
import {beginEditingTeam} from "../../slices/teamSlice";
import {AddEditTeamWizard} from "./AddEditTeamWizard";
import {MoreButton} from "../../components/MoreButton";


export const TeamDetails = () => {

    const MATCH_TILE_LIM = 6

    // handlers
    const onClickEditButton = (e) => {
        e.preventDefault()
        dispatch(beginEditingTeam({team}))
        setIsEditShown(true)
    }
    const onHideEdit = () => {
        setEmblemHash(emblemHash + 1)
        setIsEditShown(false)
    }

    const getMatchTiles = _ => {
        if (isMatchesSuccess && matches) {
            let tiles = Object.values(matches.pages[0].entities)
                .slice(0, MATCH_TILE_LIM)
                .map(match => <EventTile event={match} key={match['eventId']}/>)
            if (tiles.length >= MATCH_TILE_LIM)
                tiles.push(
                    <Link to={`/teams/team/${teamId}/events`}>
                        <MoreButton/>
                    </Link>
                )
            return tiles
        }
        return []
    }

    // state
    const params = useParams()
    const {teamId} = params
    let [isEditShown, setIsEditShown] = useState(false)
    let [emblemHash, setEmblemHash] = useState(Math.random())

    // hooks
    const dispatch = useDispatch()
    const {
        data: team,
        isLoading: isTeamLoading,
        isSuccess: isTeamSuccess,
        isError: isTeamError,
        error: teamError
    } = useFetchTeamByIdQuery(teamId)
    let name = team?.name
    const posterPlaceholder = '/img/default_team_emblem.png'
    const imageUrl = getArtworkUrl(team, 'emblem', emblemHash)
    const {
        data: matches,
        isLoading: isMatchesLoading,
        isSuccess: isMatchesSuccess,
        isError: isMatchesError,
        error: matchesError
    } = useFetchMatchesForTeamInfiniteQuery(teamId)
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
            let msg = `Failed to load Team data for ${teamId}: ` + getToastMessage(teamError);
            toast.error(msg);
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
        teamId, isMatchesError, matchesError, isCompetitionsError,
        competitionsError, isTeamError, teamError
    ])

    // components
    let matchTiles = getMatchTiles()
    let competitionTiles =
        isCompetitionsLoading ?
            <CenteredSpinner/> :
            isCompetitionsSuccess && competitions ?
                Object.values(competitions.entities).map(
                    competition => <CompetitionTile competition={competition} key={competition.id}/>
                ) :
                null

    setBackgroundImage('none')
    return (
        <>
            <AddEditTeamWizard
                teamId={teamId}
                isShown={isEditShown}
                onHideWizard={onHideEdit}
                imageUrl={imageUrl}
            />
            {
                isTeamLoading ?
                    <FillSpinner/> :
                    isTeamSuccess ?
                        <div className="Content-container">
                            <h1 className="Detail-title">{name?.name}</h1>
                            <div className="Detail-header">
                                <SoftLoadImage
                                    imageUrl={imageUrl}
                                    placeholderUrl={posterPlaceholder}
                                    alt={name?.name}
                                    className="Team-detail-poster"
                                />
                                <div className="Detail-edit-controls Team-edit-controls" onClick={onClickEditButton}>
                                    <EditButton onClick={onClickEditButton}/>
                                </div>
                            </div>
                            {
                                isMatchesLoading ?
                                    <CenteredSpinner/> :
                                    <ContentBar title={"Most recent Matches"} items={matchTiles}/>
                            }
                            <h3>Competing in</h3>
                            <div className="Entity-display">
                                {competitionTiles}
                            </div>
                        </div> :
                        <ErrorMessage>Could not load Team data</ErrorMessage>
            }
        </>
    )
}
