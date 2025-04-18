import React, {useEffect, useState} from "react";
import {VideoFileDisplay} from "./VideoFileDisplay";
import {useDispatch, useSelector} from "react-redux";
import {beganEditingVideoSource, JobStatus, selectVideoSourceById} from "../../slices/videoSourceSlice";
import {StatusBubble} from "../../components/StatusBubble";
import {useDeleteStreamsForSourceMutation, useKillStreamsForSourceMutation} from "../../slices/api/videoStreamApiSlice";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import {SmallSpinner} from "../../components/Spinner";
import {selectVideoStreams} from "../../slices/videoStreamSlice";
import md5 from "md5";
import {ConfirmationModal} from "../../components/ConfirmationModal";
import {useDeleteVideoSourceMutation} from "../../slices/api/videoSourceApiSlice";


export const VideoSourceDisplay = (props) => {

    const defaultStatus = {
        status: 'CREATED',
        completionRatio: 0,
    }
    const dispatch = useDispatch()

    // handlers
    const determineCumulativeStatus = (statuses) => {
        const QUEUED_STATES = ['QUEUED', 'STARTED', 'BUFFERING', 'STREAMING']

        let queuedCount = 0, completeCount = 0
        for (const streamStatus of statuses) {
            if (streamStatus.status === 'ERROR' || streamStatus.status === 'STOPPED')
                return streamStatus.status
            if (QUEUED_STATES.includes(streamStatus.status))
                queuedCount++
            else if (streamStatus.status === 'COMPLETED')
                completeCount++
        }

        if (completeCount === statuses.length) return 'COMPLETED'
        if (completeCount > 0 || queuedCount > 0) return 'QUEUED'
        return defaultStatus.status
    }
    const computeStreamStatus = (statuses, partCount) => {
        if (statuses.length === 0) return defaultStatus

        let status = determineCumulativeStatus(statuses)
        let cumulativeRatio = statuses.reduce((cumulativeStatus, videoStatus) =>
            cumulativeStatus + videoStatus.completionRatio, defaultStatus.completionRatio)

        return {
            status,
            completionRatio: (cumulativeRatio / partCount)
        }
    }
    const onShowEditModal = () => {
        let {_links, ...editable} = videoSource
        dispatch(beganEditingVideoSource(editable))
        onEdit && onEdit()
    }
    const onDeleteVideoSource = () => {
        setIsConfirmDelSourceShown(true)
    }
    const onCancelDelSource = () => {
        setIsConfirmDelSourceShown(false)
    }
    const onConfirmDeleteSource = async () => {
        console.log('deleting video source...', videoSourceId)
        onHide && onHide()
        await deleteSource({eventId, videoSourceId})
        console.log('... video source deleted')
    }
    const handlePlayVideoSource = () => {
        let {stream} = links
        console.log('playing stream at', stream.href)
        onPlay && onPlay(stream.href)
    }
    const onCancelStopAllStreams = () => setIsConfirmKillStreamsShown(false)
    const onStopAllStreams = async () => {
        setIsConfirmKillStreamsShown(true)
    }
    const onConfirmStopAllStreams = () => {
        console.log('stopping all video streams for video source...', eventId, videoSourceId)
        killStreams({videoSourceId})
        setIsConfirmKillStreamsShown(false)
    }
    const onDeleteAllStreams = () => {
        setIsConfirmDelVideoShown(true)
    }
    const onCancelDelVideo = () => setIsConfirmDelVideoShown(false)
    const onConfirmDeleteVideo = async () => {
        console.log('deleting all video data for video source...', eventId, videoSourceId)
        setIsConfirmDelVideoShown(false)
        await deleteStreams({videoSourceId})
        console.log('... done deleting.')
    }

    // state
    let [isConfirmDelSourceShown, setIsConfirmDelSourceShown] = useState(false)
    let [isConfirmDelVideoShown, setIsConfirmDelVideoShown] = useState(false)
    let [isConfirmKillStreamsShown, setIsConfirmKillStreamsShown] = useState(false)

    let {
        eventId,
        videoSourceId,
        isSelected,
        onSelect,
        onHide,
        onPlay,
        onEdit
    } = props
    let videoSource = useSelector(state => selectVideoSourceById(state, videoSourceId))
    let {
        audioCodec,
        bitrate,
        channel,
        approximateDuration,
        languages,
        mediaContainer,
        resolution,
        source,
        videoCodec,
        videoFiles,
        _links: links,
    } = videoSource

    // computed state
    let primaryMetadata = [resolution, videoCodec, bitrate].filter(datum => datum !== undefined && datum !== null)
    let secondaryMetadata = [source, audioCodec, mediaContainer].filter(datum => datum !== undefined && datum !== null)
    let parts = Object.values(videoFiles)
    let ids = parts.map(part => part.videoFileId)
    let streamStatuses = useSelector(state => selectVideoStreams(state, ids))
    let sourceStatus = streamStatuses ?
        computeStreamStatus(streamStatuses, parts.length) : defaultStatus
    let className = 'Video-source-display' + (isSelected ? ' selected' : '')
    let streamStatus = JobStatus[sourceStatus.status] ?? JobStatus['CREATED']

    // hooks
    let [
        killStreams, {
            data: killAllResponse,
            isLoading: isKillingAll,
            isSuccess: isKillAllSuccess,
            isError: isKillAllError,
            error: killAllError,
        }] = useKillStreamsForSourceMutation()
    let [
        deleteStreams, {
            data: deleteStreamsData,
            isLoading: isDeletingAll,
            isSuccess: isDeleteAllSuccess,
            isError: isDeleteAllError,
            error: deleteAllError,
        }] = useDeleteStreamsForSourceMutation()
    let [
        deleteSource, {
            isLoading: isDeletingSource,
            isSuccess: isSourceDeleted,
            isError: isSourceDeleteError,
            error: sourceDeleteError
        }
    ] = useDeleteVideoSourceMutation()

    // toast messages
    useEffect(() => {
        if (isKillAllSuccess) {
            toast('Successfully stopped all streams for: ' + videoSourceId)
            console.log('kill all response', killAllResponse)
        }
        if (isDeleteAllSuccess) {
            toast('Successfully deleted all streams for: ' + videoSourceId)
            console.log('delete all response', deleteStreamsData)
        }
        if (isSourceDeleted) {
            toast('Video Source successfully deleted')
        }
        if (isKillAllError) {
            let msg = 'Error stopping video streaming: ' + getToastMessage(killAllError);
            toast.error(msg);
        }
        if (isDeleteAllError) {
            let msg = 'Error deleting stream data: ' + getToastMessage(deleteAllError)
            toast.error(msg)
        }
        if (isSourceDeleteError) {
            let msg = 'Error deleting Video Source: ' + getToastMessage(sourceDeleteError)
            toast.error(msg)
        }

    }, [
        deleteAllError, deleteStreamsData, isDeleteAllError,
        isDeleteAllSuccess, isKillAllError, isKillAllSuccess,
        killAllError, killAllResponse, videoSourceId,
        isSourceDeleted, isSourceDeleteError, sourceDeleteError
    ])

    // components
    let isInFlight = isKillingAll || isDeletingAll || isDeletingSource
    return (
        <div className={className} onClick={onSelect}>
            <ConfirmationModal
                title={'Confirm: delete video data'}
                isShown={isConfirmDelVideoShown}
                onCancel={onCancelDelVideo}
                onConfirm={onConfirmDeleteVideo}>
                <img src="/img/icon/warning/warning_128.png" alt="Warning"/>
                <div>
                    <div className="Video-source-confirm-message">
                        <span>Are you sure you want to delete this video data?</span>
                        <strong style={{color: '#666'}}>
                            The data will have to be re-downloaded.
                        </strong>
                    </div>
                </div>
            </ConfirmationModal>
            <ConfirmationModal
                title={'Confirm: delete video source'}
                isShown={isConfirmDelSourceShown}
                onCancel={onCancelDelSource}
                onConfirm={onConfirmDeleteSource}>
                <img src="/img/icon/warning/warning_128.png" alt="Warning"/>
                <div>
                    <div className="Video-source-confirm-message">
                        <span>Are you sure you want to delete this Video Source?</span>
                        <div className="Video-source-details">
                            <h3 style={{marginBottom: '.5rem', color: '#aaa'}}>
                                {channel}
                            </h3>
                            <span>
                                {videoSourceId}
                            </span>
                        </div>
                        <strong style={{color: 'red', fontSize: 'large'}}>
                            This cannot be undone!
                        </strong>
                    </div>
                </div>
            </ConfirmationModal>
            <ConfirmationModal
                title={'Confirm: Stop video streams'}
                verb={'Stop'}
                isShown={isConfirmKillStreamsShown}
                onCancel={onCancelStopAllStreams}
                onConfirm={onConfirmStopAllStreams}>
                <img src="/img/icon/warning/warning_128.png" alt="Warning"/>
                <div>
                    <div className="Video-source-confirm-message">
                        <span>Are you sure you want to stop downloading this video data?</span>
                        <strong style={{color: '#666'}}>
                            You may not be able to access it again.
                        </strong>
                    </div>
                </div>
            </ConfirmationModal>

            <div className="Video-source-display-controls">
                <button className={"Close-button"} onClick={onHide}></button>
            </div>
            <div className="Video-source-display-header">
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <h3 style={{marginRight: '1rem'}}>{channel}</h3>
                    {
                        isInFlight ?
                            <SmallSpinner
                                size={'22px'}
                                style={{width: '22px', padding: '5px'}}/> :
                            <StatusBubble
                                status={streamStatus}
                                progress={sourceStatus.completionRatio}
                            />
                    }
                    <div style={{marginLeft: '1rem', display: (isSelected ? 'flex' : 'none')}}>
                        <button onClick={onShowEditModal} style={{marginRight: '1rem'}}>
                            <img src="/img/icon/edit/edit_16.png" alt="Edit source"/>
                        </button>
                        <button onClick={onDeleteVideoSource} className="delete-button">
                            <img src={'/img/icon/delete/delete_16.png'} alt="Delete stream"/>
                        </button>
                    </div>
                </div>
                <span className="Video-source-id">
                    {videoSourceId}
                </span>
                <div className="Video-source-controls-container">
                    {
                        streamStatus !== JobStatus['ERROR'] ?
                            <button className="Video-source-play-button" onClick={handlePlayVideoSource}>
                                <img src="/img/icon/play/play_16.png" alt="Play"/>
                            </button> :
                            null
                    }
                    {
                        streamStatus === JobStatus['QUEUED'] ||
                        streamStatus === JobStatus['BUFFERING'] ||
                        streamStatus === JobStatus['STREAMING'] ?
                            <button onClick={onStopAllStreams} className="Video-source-extra-control">
                                <img src={'/img/icon/stop/stop_16.png'} alt="Stop streaming"/>
                            </button> :
                            null
                    }
                    {
                        streamStatus === JobStatus['ERROR'] ||
                        streamStatus === JobStatus['STOPPED'] ||
                        streamStatus === JobStatus['COMPLETED'] ?
                            <button onClick={onDeleteAllStreams} className="Video-source-extra-control delete">
                                <img src={'/img/icon/delete/delete_16.png'} alt="Delete stream"/>
                            </button> :
                            null
                    }
                </div>
            </div>
            <div className="Video-source-metadata-fields">
                {/* todo - get flag for language */}
                <span>{languages}</span>
                <span>{approximateDuration}</span>
            </div>
            <div style={{display: 'flex'}}>
                <div className="Video-file-container">
                    {
                        parts.map(part =>
                            <VideoFileDisplay
                                key={part['videoFileId']}
                                videoFile={part}
                            />
                        )
                    }
                </div>
            </div>
            <div className="Video-source-metadata-fields" style={{color: '#ccc'}}>
                {
                    primaryMetadata.filter(datum => datum !== null)
                        .map(datum =>
                            <span key={md5(datum)}>{datum}</span>
                        )
                }
                {
                    isSelected ?
                        secondaryMetadata.map(datum =>
                            <span key={md5(datum)}>{datum}</span>
                        ) :
                        null
                }
            </div>
        </div>
    )
}
