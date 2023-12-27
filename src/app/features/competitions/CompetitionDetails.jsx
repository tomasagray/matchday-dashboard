import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useFetchCompetitionByIdQuery, useFetchTeamsForCompetitionQuery,} from "../../slices/api/competitionApiSlice";
import {CenteredSpinner, FillSpinner} from "../../components/Spinner";
import ContentBar from "../../components/ContentBar";
import {useFetchEventsForCompetitionQuery} from "../../slices/api/eventApiSlice";
import EventTile from "../events/EventTile";
import TeamTile from "../teams/TeamTile";
import {EditButton} from "../../components/controls/EditButton";
import {toast} from "react-toastify";
import {getArtworkUrl, getToastMessage, setBackgroundImage} from "../../utils";
import {beginEditingCompetition} from "../../slices/competitionSlice";
import {useDispatch} from "react-redux";
import {SoftLoadImage} from "../../components/SoftLoadImage";
import {AddEditCompetitionWizard} from "./AddEditCompetitionWizard";

export const CompetitionDetails = () => {

    const placeholderUrl = process.env.PUBLIC_URL + '/img/default_competition_poster.png'

    // handlers
    const onClickEditButton = (e) => {
        e.preventDefault()
        dispatch(beginEditingCompetition({competition}))
        setIsEditModalShown(true)
    }

    //state
    const params = useParams()
    const {competitionId} = params
    let [isEditModalShown, setIsEditModalShown] = useState(false)

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
    let posterImageUrl = getArtworkUrl(competition, 'emblem')
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
    } = useFetchEventsForCompetitionQuery(competitionId)
    let moreEvents = events?.next

    // toast messages
    useEffect(() => {
        if (isCompetitionSuccess) {
            const fanartUrl = getArtworkUrl(competition, 'fanart')
            setBackgroundImage(fanartUrl)
        }
        if (isCompetitionError) {
            let msg = `Failed to load Competition data for: ${competitionId}` + getToastMessage(competitionError);
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
            Object.values(events?.entities).map(event => <EventTile event={event}/>) :
            []
    // add more button
    if (eventTiles.length > 0 && moreEvents) {
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
                setIsShown={setIsEditModalShown}
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
