import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useFetchMatchByIdQuery, useRefreshMatchArtworkMutation} from "./eventApiSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {PlayButton} from "../../components/controls/PlayButton";
import {EditButton} from "../../components/controls/EditButton";
import Select from "../../components/controls/Select";
import {useFetchVideoSourcesForEventQuery} from "../video/videoSourceApiSlice";
import {Option} from "../../components/controls/Option";
import {VideoPlayer} from "../video/VideoPlayer";
import dayjs from "dayjs";
import {ErrorMessage} from "../../components/ErrorMessage";
import {getToastMessage} from "../../app/utils";
import {toast} from "react-toastify";
import {FindMoreContainer} from "./FindMoreContainer";
import {SoftLoadImage} from "../../components/SoftLoadImage";

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

export const EventDetails = () => {

    // handlers
    const onPlayVideo = () => {
        let src = selectedVideoSource ? selectedVideoSource['_links']['transcode_stream'].href : null
        setVideoSrc(src)
        setShowVideoPlayer(true)
    }
    const onHideVideoPlayer = () => {
        setShowVideoPlayer(false)
    }
    const onEditEvent = () => {
        console.log('edit event')
    }
    const onSelectVideoSource = (source) => () => {
        setSelectedVideoSource(source)
    }
    const onRefreshArtwork = async () => {
        if (!isArtworkRefreshing) {
            await refreshArtwork(eventId)
        }
    }

    // state
    const imagePlaceholderUrl = process.env.PUBLIC_URL + '/img/default_event_poster.png'
    const params = useParams()
    const {eventId} = params
    let [selectedVideoSource, setSelectedVideoSource] = useState()
    let [showVideoPlayer, setShowVideoPlayer] = useState(false)

    let [videoSrc, setVideoSrc] = useState(null)
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
        refreshArtwork, {
            // data: refreshedArtwork,
            // isSuccess: isArtworkRefreshed,
            isLoading: isArtworkRefreshing,
            isError: isArtworkError,
            error: artworkError
    }] = useRefreshMatchArtworkMutation(eventId)

    // toast messages
    useEffect(() => {
        if (isEventError) {
            let msg = `Failed to load data for Event ${eventId}: ` + getToastMessage(eventError)
            toast.error(msg)
        }
        if (isVideoSourceError) {
            let msg = 'Could not load video source data: ' + getToastMessage(videoSourceError)
            toast.error(msg)
        }
        if (isArtworkError) {
            let msg = 'Error refreshing artwork: ' + getToastMessage(artworkError)
            toast.error(msg)
        }
    }, [
        eventId, isEventError, eventError, isVideoSourceError,
        videoSourceError, isArtworkError, artworkError
    ])

    // components
    let date = event ? dayjs(event['date']) : dayjs()
    let formattedDate = date.format('MM/DD/YY')
    let fixture = event && event['fixture']['fixtureNumber'] > 0 ?
        <span>
            {event['fixture']['title']} {event['fixture']['fixtureNumber']}
            <br/>
        </span> :
        null
    let findMore = event ? getFindMoreDisplay(event) : null
    let videoSourceOptions =
        isVideoSourcesLoading ?
            <CenteredSpinner /> :
            isVideoSourceSuccess ?
                Object.values(videoSources.entities).map(videoSource =>
                    <Option onClick={onSelectVideoSource(videoSource)} value={videoSource.channel} key={videoSource.id}>
                        {videoSource.channel}
                    </Option>
                ) :
            <ErrorMessage>Could not load video source data</ErrorMessage>

    return (
        <>
            {
                isEventLoading ?
                    <CenteredSpinner /> :
                    isEventSuccess ?
                    <div className="Content-container">
                        <VideoPlayer
                            src={videoSrc}
                            hidden={!showVideoPlayer}
                            onClose={onHideVideoPlayer}
                            title={event['title']}
                            subtitle={formattedDate}
                        />
                        <h2 className="Event-detail-header">
                            {event['competition'].name?.name} &nbsp;&nbsp;
                            <span className={"Team-name"}>{event['homeTeam'].name?.name}</span>
                            <span style={{color: '#888'}}> vs.&nbsp;</span>
                            <span className={"Team-name"}>{event['awayTeam'].name?.name}</span>
                        </h2>
                        <div className="Event-details-container">
                            <div className="Event-poster-container">
                                <SoftLoadImage
                                    placeholderUrl={imagePlaceholderUrl}
                                    imageUrl={event['_links']['artwork'].href}
                                    className="Event-poster"
                                />
                                <div className="Refresh-event-artwork-button" onClick={onRefreshArtwork}>
                                        {
                                            isArtworkRefreshing ?
                                                <CenteredSpinner /> :
                                                <div className="Spinner-container">
                                                    <img
                                                        src={process.env.PUBLIC_URL + '/img/icon/refresh/refresh_32.png'}
                                                        alt="Refresh artwork"
                                                    />
                                                </div>

                                        }
                                </div>
                            </div>
                            <div>
                                <span style={{color: '#aaa'}}>{formattedDate}</span><br/>
                                {fixture}
                                {selectedVideoSource?.duration}
                            </div>
                        </div>
                        <div className="Event-button-container">
                            <PlayButton onClick={onPlayVideo} disabled={selectedVideoSource === undefined} />
                            <Select placeholder="Select source" selectedValue={selectedVideoSource?.channel}>
                                {videoSourceOptions}
                            </Select>
                            <EditButton onClick={onEditEvent} />
                        </div>
                        <div className="Video-source-metadata">
                            {
                                selectedVideoSource ?
                                Object.entries(selectedVideoSource)
                                    .filter(([field,]) => field !== '_links' && field !== 'id')
                                    .map(([field, value]) =>
                                        <div className="Video-source-metadata-field" key={field}>
                                            <div className={"Video-source-metadata-field-name"}>
                                                {
                                                    field.replace(/([A-Z])/g, " $1")
                                                        .replace(/^./, str => str.toUpperCase())
                                                }
                                            </div>
                                            <div className={"Video-source-metadata-field-value"}>
                                                {value}
                                            </div>
                                        </div>
                                ) : null
                            }
                        </div>
                        {findMore}
                    </div> :
                    <ErrorMessage>Could not load Event data</ErrorMessage>
            }
        </>
    )
}
