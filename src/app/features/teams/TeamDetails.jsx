import ContentBar from "../../components/ContentBar";
import {Link, useParams} from "react-router-dom";
import {useFetchCompetitionsForTeamQuery, useFetchTeamByIdQuery} from "../../slices/api/teamApiSlice";
import {CenteredSpinner, FillSpinner} from "../../components/Spinner";
import {useFetchMatchesForTeamQuery} from "../../slices/api/eventApiSlice";
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


export const TeamDetails = () => {

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
    const posterPlaceholder = process.env.PUBLIC_URL + '/img/default_team_emblem.png'
    const imageUrl = getArtworkUrl(team, 'emblem', emblemHash)
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
    let matchTiles =
        isMatchesSuccess && matches ?
            Object.values(matches.entities)
                .map(match => <EventTile event={match} key={match['eventId']}/>) :
            []
    if (matchTiles.length > 0 && matches?.next) {
        matchTiles.push(
            <Link to={"/events"}>
                <div style={{padding: '1.5rem'}}>
                    <div className="More-button">
                        <img src={'/img/icon/more/more_32.png'} alt="More..."/>
                    </div>
                </div>
            </Link>
        )
    }
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
