import React, {useEffect, useState} from "react";
import {VideoFileDisplay} from "./VideoFileDisplay";
import {useSelector} from "react-redux";
import {JobStatus, selectVideoSourceById} from "../../slices/videoSourceSlice";
import {StatusBubble} from "../../components/StatusBubble";
import {
    useDeleteStreamsForSourceMutation,
    useKillStreamsForSourceMutation
} from "../../slices/api/videoSourceApiSlice";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import {SmallSpinner} from "../../components/Spinner";

export const VideoSourceDisplay = (props) => {

    // handlers
    const handlePlayVideoSource = () => {
        let {stream} = links
        console.log('playing stream at', stream.href)
        onPlay && onPlay(stream.href)
    }
    const onStopAllStreams = async () => {
        console.log('stop all video streams for video source...', eventId, videoSourceId)
        let streams = await killStreams({eventId, videoSourceId})
        console.log('streams killed', streams)
    }
    const onDeleteAllStreams = async () => {
        console.log('deleting all video data for video source...', eventId, videoSourceId)
        await deleteStreams({eventId, videoSourceId})
        console.log('done deleting.')
    }
    const onDownloadStream = async (id) => {
        toast('TODO: Implement individual download')
        console.log('id', id)
    }
    const onUpdateStreamStatus = (status) => {
        setFileStatuses({
            ...fileStatuses,
            [status['videoFileId']]: status,
        })
    }
    const computeStreamStatus = (statuses) => {
        if (statuses.length === 0) {
            return {
                status: null,
                progress: 0,
            }
        }
        let finalStatus = statuses.reduce((finalStatus, videoStatus) => {
            return {
                completionRatio: finalStatus.completionRatio + videoStatus.completionRatio,
                status:
                    finalStatus.status !== null &&
                    JobStatus[finalStatus.status] > JobStatus[videoStatus.status] ?
                        finalStatus.status : videoStatus.status
            }
        }, {
            status: null,
            completionRatio: 0,
        })
        return {
            status: finalStatus.status,
            progress: finalStatus.completionRatio / statuses.length
        }
    }

    // state
    let {
        eventId,
        videoSourceId,
        isSelected,
        onSelect,
        onHide,
        onPlay,
    } = props
    let videoSource = useSelector(
        state => selectVideoSourceById(state, videoSourceId)
    )
    let {
        audioCodec,
        bitrate,
        channel,
        duration,
        languages,
        mediaContainer,
        resolution,
        source,
        videoCodec,
        videoFiles,
        _links: links,
    } = videoSource
    let [fileStatuses, setFileStatuses] = useState({})
    // computed state
    let sourceStatus = computeStreamStatus(Object.values(fileStatuses))
    let parts = Object.values(videoFiles)

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
        if (isKillAllError) {
            let msg = 'Error stopping video streaming: ' + getToastMessage(killAllError)
            toast.error(msg);
        }
        if (isDeleteAllError) {
            let msg = 'Error deleting stream data: ' + getToastMessage(deleteAllError)
            toast.error(msg)
        }

    }, [
        deleteAllError, deleteStreamsData, isDeleteAllError,
        isDeleteAllSuccess, isKillAllError, isKillAllSuccess,
        killAllError, killAllResponse, videoSourceId
    ])

    // components
    let className = "Video-source-display" + (isSelected ? ' selected' : '')
    let streamStatus = JobStatus[sourceStatus.status] ?? JobStatus['CREATED']
    return (
        <div className={className} onClick={onSelect}>
            <div className="Video-source-display-header">
                <h3 style={{marginRight: '1rem'}}>{channel}</h3>
                <div className="Video-source-controls-container">
                    {
                        isKillingAll || isDeletingAll ?
                            <SmallSpinner
                                size={'22px'}
                                style={{width: '22px', padding: '5px'}} /> :
                            <StatusBubble
                                status={sourceStatus.status}
                                progress={sourceStatus.progress}
                            />
                    }
                    {
                        streamStatus !== JobStatus['ERROR'] ?
                            <button className="Video-source-play-button" onClick={handlePlayVideoSource}>
                                <img src="/img/icon/play/play_16.png" alt="Play" />
                            </button> :
                            null
                    }
                    {
                        streamStatus === JobStatus['BUFFERING'] || streamStatus === JobStatus['STREAMING'] ?
                            <button onClick={onStopAllStreams} className="Video-source-extra-control">
                                <img src={'/img/icon/stop/stop_16.png'} alt="Stop streaming" />
                            </button> :
                            null
                    }
                    {
                        streamStatus === JobStatus['ERROR'] ||
                        streamStatus === JobStatus['STOPPED'] ||
                        streamStatus === JobStatus['COMPLETED'] ?
                            <button onClick={onDeleteAllStreams} className="Video-source-extra-control delete">
                                <img src={'/img/icon/delete/delete_16.png'} alt="Delete stream" />
                            </button> :
                            null
                    }
                </div>
            </div>
            <span style={{color: '#666', fontSize: '8pt'}}>
                {videoSourceId}
            </span>
            <div className="Video-source-metadata-fields">
                {/* todo - get flag for language */}
                <span>{languages}</span>
                <span>{duration}</span>
            </div>
            <div style={{display: 'flex'}}>
                <div className="Video-file-container">
                    {
                        parts.map(part =>
                            <VideoFileDisplay
                                key={part['videoFileId']}
                                videoFile={part}
                                eventId={eventId}
                                onUpdateStream={onUpdateStreamStatus}
                                onStartStream={onDownloadStream}
                            />
                        )
                    }
                </div>
            </div>
            <div className="Video-source-metadata-fields" style={{color: '#ccc'}}>
                <span>{resolution}</span>
                <span>{videoCodec}</span>
                <span>{bitrate}</span>
                {
                    isSelected ?
                        <>
                            <span>{source}</span>
                            <span>{mediaContainer}</span>
                            <span>{audioCodec}</span>
                        </> :
                        null
                }

            </div>
            <div className="Video-source-display-close-button">
                <button className={"Close-button"} onClick={onHide}></button>
            </div>
        </div>
    )
}
