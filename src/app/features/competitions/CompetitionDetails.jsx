import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useFetchCompetitionByIdQuery, useFetchTeamsForCompetitionQuery,} from "../../slices/api/competitionApiSlice";
import {CenteredSpinner, FillSpinner} from "../../components/Spinner";
import ContentBar from "../../components/ContentBar";
import {useFetchEventsForCompetitionInfiniteQuery} from "../../slices/api/eventApiSlice";
import EventTile from "../events/EventTile";
import TeamTile from "../teams/TeamTile";
import {EditButton} from "../../components/controls/EditButton";
import {toast} from "react-toastify";
import {getArtworkUrl, getToastMessage, setBackgroundImage} from "../../utils";
import {beginEditingCompetition} from "../../slices/competitionSlice";
import {useDispatch} from "react-redux";
import {SoftLoadImage} from "../../components/SoftLoadImage";
import {AddEditCompetitionWizard} from "./AddEditCompetitionWizard";
import {MoreButton} from "../../components/MoreButton";


export const CompetitionDetails = () => {

    const MAX_EVENTS = 6
    const placeholderUrl = '/img/default_competition_poster.png'

    // handlers
    const onClickEditButton = (e) => {
        e.preventDefault()
        dispatch(beginEditingCompetition({competition}))
        setIsEditModalShown(true)
    }
    const onHideEdit = () => {
        setPosterHash(posterHash + 1)
        setIsEditModalShown(false)
    }

    //state
    const params = useParams()
    const {competitionId} = params
    let [isEditModalShown, setIsEditModalShown] = useState(false)
    let [posterHash, setPosterHash] = useState(Math.random())

    // hooks
    const dispatch = useDispatch()
    const {
        data: competition,
        isLoading: isCompetitionLoading,
        isSuccess: isCompetitionSuccess,
        isError: isCompetitionError,
        error: competitionError
    } = useFetchCompetitionByIdQuery(competitionId)
    let name = competition?.name
    let posterImageUrl = getArtworkUrl(competition, 'emblem', posterHash)
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
        isSuccess: isEventsSuccess,
        isError: isEventsError,
        error: eventsError
    } = useFetchEventsForCompetitionInfiniteQuery(competitionId)

    // toast messages
    useEffect(() => {
        if (isCompetitionSuccess) {
            const fanartUrl = getArtworkUrl(competition, 'fanart')
            setBackgroundImage(fanartUrl)
        }
        if (isCompetitionError) {
            let msg = `Failed to load Competition data for: ${competitionId}` + getToastMessage(competitionError)
            toast.error(msg);
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
        competitionId, isCompetitionError, competitionError, isEventsError,
        eventsError, isTeamsError, teamsError, isCompetitionSuccess, competition
    ])

    // components
    let eventTiles =
        isEventsSuccess && events ?
            Object.values(events?.pages[0].entities)
                .slice(0, MAX_EVENTS)
                .map(event => <EventTile event={event}/>) :
            []
    // add 'more' button
    if (eventTiles.length >= MAX_EVENTS)
        eventTiles.push(
            <Link to={`/competitions/competition/${competitionId}/events`}>
                <MoreButton/>
            </Link>
        )

    let teamTiles =
        isTeamsSuccess && teams ?
            Object.values(teams.entities).map(
                team => <TeamTile team={team} key={team.id}/>
            ) : []

    return (
        <>
            <AddEditCompetitionWizard
                competitionId={competitionId}
                imageUrl={posterImageUrl}
                isShown={isEditModalShown}
                onHideWizard={onHideEdit}
            />
            {
                isCompetitionLoading ?
                    <FillSpinner/> :
                    isCompetitionSuccess ?
                        <div>
                            <h1 className="Detail-title">{name?.name}</h1>
                            <div className="Detail-header">
                                <SoftLoadImage
                                    imageUrl={posterImageUrl}
                                    placeholderUrl={placeholderUrl}
                                    className="Detail-poster"
                                />
                                <div className="Detail-edit-controls" onClick={onClickEditButton}>
                                    <EditButton onClick={onClickEditButton}/>
                                </div>
                            </div>
                            {
                                isEventsLoading ?
                                    <CenteredSpinner/> :
                                    <ContentBar title="Most recent events" items={eventTiles}/>
                            }
                            <div className="Competition-teams-container">
                                <h2 className="Content-bar-title">Teams</h2>
                                {
                                    isTeamsLoading ?
                                        <CenteredSpinner/> :
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
