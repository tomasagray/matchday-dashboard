import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDeleteMatchMutation, useFetchMatchByIdQuery, useUpdateMatchMutation} from "./eventApiSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {useFetchVideoSourcesForEventQuery} from "../video/videoSourceApiSlice";
import {VideoPlayer} from "../video/VideoPlayer";
import dayjs from "dayjs";
import {ErrorMessage} from "../../components/ErrorMessage";
import {getToastMessage} from "../../app/utils";
import {toast} from "react-toastify";
import {FindMoreContainer} from "./FindMoreContainer";
import {SoftLoadImage} from "../../components/SoftLoadImage";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {useDispatch, useSelector} from "react-redux";
import {beginEditMatch, selectEditedMatchForUpload} from "./matchSlice";
import {MatchEditWizard} from "./MatchEditWizard";
import {SaveButton} from "../../components/controls/SaveButton";
import {CancelButton} from "../../components/controls/CancelButton";
import {WarningMessage} from "../../components/WarningMessage";
import {DeleteButton} from "../../components/controls/DeleteButton";
import {VideoSourceDisplay} from "./VideoSourceDisplay";
import {StompSessionProvider} from "react-stomp-hooks";

const getFindMoreDisplay = (event) => {
    let competitionId, homeTeamId, awayTeamId
    if (event) {
        let {competition, homeTeam, awayTeam} = event
        if (competition) {
            competitionId = competition['id']
        }
        if (homeTeam) {
            homeTeamId = homeTeam['id']
        }
        if (awayTeam) {
            awayTeamId = awayTeam['id']
        }
        return <FindMoreContainer
                competitionId={competitionId}
                homeTeamId={homeTeamId}
                awayTeamId={awayTeamId} />
    }
    return null
}

export const getEventTitle = (match) => {

    let {competition, homeTeam, awayTeam} = match
    let competitionName = competition.name?.name
    let homeTeamName = homeTeam.name?.name
    let awayTeamName = awayTeam.name?.name

    return (
        <>
            {competitionName} &nbsp;
            <span className={"Team-name"}>{homeTeamName}</span>
            <span style={{color: '#888'}}> vs.&nbsp;</span>
            <span className={"Team-name"}>{awayTeamName}</span> <br/>
        </>
    )
}

export const getEventPosterUrl = (event) => {
    if (event === undefined) {
        return null
    }
    let {_links: links} = event
    return links['artwork'].href
}

export const EventDetails = () => {

    // handlers
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onPlayVideo = () => {
        let src = null
        setVideoSrc(src)
        setShowVideoPlayer(true)
    }
    const onHideVideoPlayer = () => {
        setShowVideoPlayer(false)
    }
    const onEditEvent = () => {
        setIsEditModalShown(true)
        dispatch(beginEditMatch(event))
    }
    const onHideEditModal = () => {
        setIsEditModalShown(false)
    }
    const onSaveEditedEvent = async () => {
        await updateMatch(editedMatchForUpload)
        onHideEditModal()
    }
    const onDeleteEvent = () => {
        setIsEditModalShown(false)
        onShowHideDeleteConfirm()
    }
    const onShowHideDeleteConfirm = () => {
        setIsDeleteConfirmShown(!isDeleteConfirmShown)
    }
    const onCancelDeleteEvent = () => {
        onShowHideDeleteConfirm()
        setIsEditModalShown(true)
    }
    const onConfirmDeleteEvent = async () => {
        console.log('deleting match...')
        await deleteMatch(eventId)
            .unwrap()
            .then(() => {
                setIsDeleteConfirmShown(false)
                navigate('/events')
            })
            .catch(err => console.error('ERROR deleting Event', err))
        console.log('done deleting')
    }

    // state
    const webSocketProtocol = 'http'
    const webSocketUrl = `${webSocketProtocol}://localhost:8080/api/ws`
    const imagePlaceholderUrl = process.env.PUBLIC_URL + '/img/default_event_poster.png'
    const params = useParams()
    const {eventId} = params
    let editedMatchForUpload = useSelector(state => selectEditedMatchForUpload(state))
    let [videoSrc, setVideoSrc] = useState(null)
    let [showVideoPlayer, setShowVideoPlayer] = useState(false)
    let [isEditModalShown, setIsEditModalShown] = useState(false)
    let [isDeleteConfirmShown, setIsDeleteConfirmShown] = useState(false)
    let [selectedVideoSource, setSelectedVideoSource] = useState(null)

    // hooks
    const {
        data: event,
        isLoading: isEventLoading,
        isSuccess: isEventSuccess,
        isError: isEventError,
        error: eventError
    } = useFetchMatchByIdQuery(eventId)
    const {
        data: videoSources,
        isLoading: isVideoSourcesLoading,
        isSuccess: isVideoSourceSuccess,
        isError: isVideoSourceError,
        error: videoSourceError
    } = useFetchVideoSourcesForEventQuery(eventId)
    const [
        updateMatch, {
            data: updatedMatch,
            isLoading: isMatchUpdating,
            isSuccess: isMatchUpdateSuccess,
            isError: isMatchUpdateError,
            error: matchUpdateError
        }
    ] = useUpdateMatchMutation()
    const [
        deleteMatch, {
            data: deletedMatchId,
            isLoading: isDeletingMatch,
            isSuccess: isDeleteMatchSuccess,
            isError: isDeleteMatchError,
            error: deleteMatchError
        }
    ] = useDeleteMatchMutation()

    // toast messages
    useEffect(() => {
        if (isEventSuccess) {
            const bg = document.getElementsByClassName('Background-container')[0]
            let art = event.competition['_links']['fanart'].href
            bg['style'].backgroundImage = `url(${art})`
        }
        if (isEventError) {
            let msg = `Failed to load data for Event ${eventId}: ` + getToastMessage(eventError);
            toast.error(msg);
        }
        if (isVideoSourceError) {
            let msg = 'Could not load video source data: ' + getToastMessage(videoSourceError)
            toast.error(msg)
        }
        if (isMatchUpdateSuccess) {
            toast('Successfully updated match: ' + updatedMatch.title)
        }
        if (isMatchUpdateError) {
            let msg = 'Error updating match: ' + getToastMessage(matchUpdateError)
            toast.error(msg)
        }
        if (isDeleteMatchSuccess) {
            toast(`Successfully deleted Event: ${deletedMatchId}`)
        }
        if (isDeleteMatchError) {
            let msg = 'Error deleting Event: ' + getToastMessage(deleteMatchError)
            toast.error(msg)
        }
    }, [
        eventId, isEventError, eventError, isVideoSourceError,
        videoSourceError, isEventSuccess, event, isMatchUpdateSuccess,
        isMatchUpdateError, matchUpdateError, updatedMatch?.title,
        isDeleteMatchSuccess, isDeleteMatchError, deleteMatchError,
        deletedMatchId
    ])

    // components
    let date = event ? dayjs(event['date']) : dayjs()
    let formattedDate = date.format('MM/DD/YY')
    let findMore = event ? getFindMoreDisplay(event) : null
    const posterUrl = getEventPosterUrl(event)
    let eventTitle = event != null ? getEventTitle(event) : null
    let videoSourceOptions =
        isVideoSourcesLoading ?
            <CenteredSpinner /> :
            isVideoSourceSuccess ?
                selectedVideoSource !== null ?
                    <VideoSourceDisplay
                        videoSourceId={videoSources.entities[selectedVideoSource].id}
                        onHide={() => setSelectedVideoSource(null)}
                        isSelected={true}
                    /> :
                Object.values(videoSources.ids).sort().map(videoSourceId =>
                    <VideoSourceDisplay
                        videoSourceId={videoSourceId}
                        key={videoSourceId}
                        onSelect={() => setSelectedVideoSource(videoSourceId)}
                    />
                ) :
            <ErrorMessage>Could not load video source data</ErrorMessage>

    return (
        <>
            <Modal show={isEditModalShown}>
                <Header onHide={onHideEditModal}>
                    Edit &mdash; &nbsp;
                    <span style={{color: '#ccc'}}>
                        {eventTitle}
                    </span>
                </Header>
                <Body>
                    <MatchEditWizard eventId={eventId} onDelete={onDeleteEvent} />
                </Body>
                <Footer>
                    <SaveButton onClick={onSaveEditedEvent} isLoading={isMatchUpdating} />
                    <CancelButton onClick={onHideEditModal}/>
                </Footer>
            </Modal>
            <Modal show={isDeleteConfirmShown}>
                <Header onHide={onShowHideDeleteConfirm}>
                    Confirm: DELETE <span style={{color: '#ccc'}}>{eventTitle}</span>
                </Header>
                <Body>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <WarningMessage>
                            <span style={{color: '#888'}}>
                                Are you <strong>sure</strong> you want to delete the Event: <br/>
                            </span>
                            <strong>{eventTitle}</strong> <br/>
                            <strong style={{color: 'red'}}>This CANNOT be undone!</strong>
                        </WarningMessage>
                    </div>
                </Body>
                <Footer>
                    <DeleteButton onClick={onConfirmDeleteEvent} isLoading={isDeletingMatch} />
                    <CancelButton onClick={onCancelDeleteEvent} />
                </Footer>
            </Modal>
            {
                isEventLoading ?
                    <CenteredSpinner /> :
                    isEventSuccess ?
                    <div className="Content-container">
                        <VideoPlayer src={videoSrc} hidden={!showVideoPlayer} onClose={onHideVideoPlayer}
                                     title={event['title']} subtitle={formattedDate}/>

                        <div className="Event-detail-header-container">
                            <h2 className="Event-detail-header">
                                {eventTitle}
                            </h2>
                            <span style={{color: '#888', fontSize: '11pt '}}>{formattedDate}</span><br/>
                        </div>

                        <div className="Event-details-container">
                            <div className="Event-poster-container">
                                <SoftLoadImage placeholderUrl={imagePlaceholderUrl}
                                               imageUrl={posterUrl} className="Event-poster"/>
                                <div className="Edit-event-button" onClick={onEditEvent}>
                                    <div className="Spinner-container">
                                        <img src={process.env.PUBLIC_URL + '/img/icon/edit/edit_32.png'}
                                             alt="Refresh artwork"/>
                                    </div>
                                </div>
                            </div>
                            <div className="Video-source-display-container">
                                <StompSessionProvider url={webSocketUrl}>
                                    {videoSourceOptions}
                                </StompSessionProvider>
                            </div>
                        </div>
                        {findMore}
                    </div> :
                    <ErrorMessage>Could not load Event data</ErrorMessage>
            }
        </>
    )
}
