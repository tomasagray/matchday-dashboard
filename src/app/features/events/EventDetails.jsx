import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDeleteMatchMutation, useFetchMatchByIdQuery, useUpdateMatchMutation} from "../../slices/api/eventApiSlice";
import {CenteredSpinner, FillSpinner} from "../../components/Spinner";
import {useFetchVideoSourcesForEventQuery} from "../../slices/api/videoSourceApiSlice";
import {VideoPlayer} from "../video/VideoPlayer";
import dayjs from "dayjs";
import {ErrorMessage} from "../../components/ErrorMessage";
import {getToastMessage, setBackgroundImage} from "../../utils";
import {toast} from "react-toastify";
import {FindMoreContainer} from "./FindMoreContainer";
import {SoftLoadImage} from "../../components/SoftLoadImage";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {useDispatch, useSelector} from "react-redux";
import {beginEditMatch, finishEditMatch, selectEditedMatchForUpload} from "../../slices/matchSlice";
import {AddEditMatchWizard} from "./AddEditMatchWizard";
import {SaveButton} from "../../components/controls/SaveButton";
import {CancelButton} from "../../components/controls/CancelButton";
import {WarningMessage} from "../../components/WarningMessage";
import {DeleteButton} from "../../components/controls/DeleteButton";
import {VideoSourceDisplay} from "./VideoSourceDisplay";
import {StompSessionProvider} from "react-stomp-hooks";
import properties from "../../properties";
import {AddButton} from "../../components/controls/AddButton";
import {AddEditVideoSource} from "./AddEditVideoSource";
import {InfoMessage} from "../../components/InfoMessage";


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
            awayTeamId={awayTeamId}/>
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
            <span style={{color: '#666'}}> vs&nbsp;</span>
            <span className={"Team-name"}>{awayTeamName}</span> <br/>
        </>
    )
}

export const getEventPosterUrl = (event) => {
    if (event === undefined) {
        return null
    }
    let {_links: links} = event
    return links['artwork']?.href ?? '/img/default_event_poster.png'
}

export const EventDetails = () => {

    // handlers
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onPlayVideo = (videoSource) => {
        console.log('playing video source', videoSource)
        setVideoSrc(videoSource)
        setShowVideoPlayer(true)
    }
    const onStopVideo = () => {
        console.log('stopping video playback...')
        setVideoSrc(null)
        setShowVideoPlayer(false)
    }
    const onEditEvent = () => {
        setIsEditModalShown(true)
        dispatch(beginEditMatch(event))
    }
    const onHideEditModal = () => {
        setIsEditModalShown(false)
        dispatch(finishEditMatch())
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
                dispatch(finishEditMatch())
                navigate('/events')
            })
            .catch(err => console.error('ERROR deleting Event', err))
        console.log('done deleting match')
    }
    const onShowVideoSourceEdit = () => {
        setIsEditVideoSourceShown(true)
    }
    const onHideEditVideoSourceModal = () => {
        setIsEditVideoSourceShown(false)
    }

    // state
    const imagePlaceholderUrl = '/img/default_event_poster.png'
    const params = useParams()
    const {eventId} = params
    let editedMatchForUpload = useSelector(state => selectEditedMatchForUpload(state))
    let [videoSrc, setVideoSrc] = useState(null)
    let [selectedVideoSource, setSelectedVideoSource] = useState(null)
    let [showVideoPlayer, setShowVideoPlayer] = useState(false)
    let [isEditModalShown, setIsEditModalShown] = useState(false)
    let [isDeleteConfirmShown, setIsDeleteConfirmShown] = useState(false)
    let [isEditVideoSourceShown, setIsEditVideoSourceShown] = useState(false)

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
            let artworkUrl = event.competition['_links']['fanart'].href
            setBackgroundImage(artworkUrl)
        }
        if (isEventError) {
            let msg = `Failed to load data for Event ${eventId}: ` + getToastMessage(eventError);
            toast.error(msg);
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

    const ExampleButton = () => {
        let style = {cursor: 'text', display: 'inline', margin: '0 3px 0 9px'}
        return <AddButton disabled style={style}/>
    }
    let videoSourceOptions =
        isVideoSourcesLoading ?
            <CenteredSpinner/> :
            isVideoSourceSuccess ?
                selectedVideoSource !== null ?
                    <VideoSourceDisplay
                        eventId={eventId}
                        videoSourceId={videoSources.entities[selectedVideoSource].id}
                        isSelected={true}
                        onHide={() => setSelectedVideoSource(null)}
                        onPlay={onPlayVideo}
                        onEdit={onShowVideoSourceEdit}
                    /> :
                    Object.values(videoSources.ids).sort().map(videoSourceId =>
                        <VideoSourceDisplay
                            eventId={eventId}
                            videoSourceId={videoSourceId}
                            key={videoSourceId}
                            onSelect={() => setSelectedVideoSource(videoSourceId)}
                        />
                    ) :
                <InfoMessage>
                    There are currently no Video Sources for this Event. Add one by clicking the <ExampleButton/>
                    button above.
                </InfoMessage>

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
                    <AddEditMatchWizard eventId={eventId} onDelete={onDeleteEvent}/>
                </Body>
                <Footer>
                    <CancelButton onClick={onHideEditModal}/>
                    <SaveButton onClick={onSaveEditedEvent} isLoading={isMatchUpdating}/>
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
                    <DeleteButton onClick={onConfirmDeleteEvent} isLoading={isDeletingMatch}/>
                    <CancelButton onClick={onCancelDeleteEvent}/>
                </Footer>
            </Modal>
            <AddEditVideoSource
                eventId={eventId}
                isShown={isEditVideoSourceShown}
                onHide={onHideEditVideoSourceModal}/>
            {
                isEventLoading ?
                    <FillSpinner/> :
                    isEventSuccess ?
                        <div className="Content-container">
                            <VideoPlayer
                                src={videoSrc}
                                hidden={!showVideoPlayer}
                                onStop={onStopVideo}
                                title={event['title']}
                                subtitle={formattedDate}
                            />
                            <div className="Event-detail-header-container">
                                <h2 className="Event-detail-header">
                                    {eventTitle}
                                </h2>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <span style={{color: '#888', fontSize: '11pt '}}>
                                        {formattedDate}
                                    </span>
                                    {
                                        event.fixture ?
                                            <span style={{color: '#aaa'}}>
                                                &nbsp;&mdash;&nbsp;
                                                {event?.fixture?.title}
                                            </span> :
                                            null
                                    }
                                    <span>
                                    </span>
                                </div>
                            </div>
                            <div className="Event-details-container">
                                <div className="Event-poster-container">
                                    <SoftLoadImage placeholderUrl={imagePlaceholderUrl}
                                                   imageUrl={posterUrl} className="Event-poster"/>
                                    <div className="Edit-event-button" onClick={onEditEvent}>
                                        <div className="Spinner-container">
                                            <img src={'/img/icon/edit/edit_32.png'}
                                                 alt="Refresh artwork"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="Video-source-display-container">
                                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                                        <img
                                            src="/img/icon/video-source/video-source_32.png"
                                            alt="Video sources"
                                            style={{
                                                margin: '0 1rem 0 .5rem',
                                                opacity: .7,
                                                width: '24px',
                                            }}
                                        />
                                        <h3 style={{color: 'rgba(180,180,180,.75)', marginRight: '1rem'}}>
                                            Video sources
                                        </h3>
                                        <AddButton onClick={onShowVideoSourceEdit}/>
                                    </div>
                                    <StompSessionProvider url={properties.websocketUrl}>
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
