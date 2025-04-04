import React, {useEffect, useState} from "react";
import {StatusBubble} from "../../components/StatusBubble";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {JobStatus} from "../../slices/videoSourceSlice";
import {
    useDeleteStreamMutation,
    useDownloadStreamMutation,
    useKillStreamMutation
} from "../../slices/api/videoStreamApiSlice";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import {SmallSpinner} from "../../components/Spinner";
import {VideoStreamingErrorDisplay} from "./VideoStreamingErrorDisplay";
import {useDispatch, useSelector} from "react-redux";
import {selectVideoStream, videoStreamUpdated} from "../../slices/videoStreamSlice";
import properties from "../../properties";
import {ConfirmationModal} from "../../components/ConfirmationModal";

export const VideoFileDisplay = (props) => {

    // handlers
    const onUpdateStream = (status) => {
        dispatch(videoStreamUpdated(status))
    }
    const onStartStream = (url) => downloadStream(url)
    const onStopStream = () => setIsConfirmKillStreamShown(true)
    const onCancelStopStream = () => setIsConfirmKillStreamShown(false)
    const onConfirmStopStream = () => {
        console.log('attempting to kill stream for video file:', videoFileId)
        killStream({videoFileId})
        setIsConfirmKillStreamShown(false)
    }
    const onDeleteStream = () => setIsConfirmDeleteStreamShown(true)
    const onCancelDeleteStream = () => setIsConfirmDeleteStreamShown(false)
    const onConfirmDeleteStream = () => {
        console.log('deleting video stream data...', videoFileId)
        deleteStream({videoFileId})
        setIsConfirmDeleteStreamShown(false)
    }
    const onShowErrorModal = () => {
        setErrorModalShown(true)
    }
    const onHideErrorModal = () => {
        setErrorModalShown(false)
    }
    const getVideoStreamStatus = (streamStatus) => {
        if (streamStatus) {
            let status = streamStatus['status']
            if (status) return JobStatus[status]
        }
        return JobStatus['CREATED']
    }


    // state
    let {videoFile} = props
    let {videoFileId, _links: links} = videoFile
    let streamStatus = useSelector(state => selectVideoStream(state, videoFileId))
    let [isErrorModalShown, setErrorModalShown] = useState(false)
    let [isConfirmKillStreamShown, setIsConfirmKillStreamShown] = useState(false)
    let [isConfirmDeleteStreamShown, setIsConfirmDeleteStreamShown] = useState(false)

    // computed state
    let videoStreamStatus = getVideoStreamStatus(streamStatus)
    let completionRatio = streamStatus ? streamStatus['completionRatio'] : 0

    // hooks
    const dispatch = useDispatch()
    const stompClient = useStompClient()
    // request data ...
    useEffect(() => {
        if (stompClient) {
            stompClient.publish({
                destination: properties.websocketRoot + '/subscribe/video-stream-status',
                body: JSON.stringify(videoFileId)
            })
        }
    }, [stompClient, videoFile, videoFileId])
    // ... get data
    useSubscription(properties.websocketRoot + '/subscription/video-stream-status', (msg) => {
        let status = JSON.parse(msg.body)
        if (videoFileId === status['videoFileId']) {
            onUpdateStream(status)
        }
    })

    let [
        downloadStream, {
            // isLoading: isDownloading,
            isSuccess: isDownloadSuccess,
            isError: isDownloadError,
            error: downloadError
        }] = useDownloadStreamMutation()
    let [
        killStream, {
            isLoading: isKillingStream,
            isSuccess: isKillSuccess,
            isError: isKillError,
            error: killError,
        }] = useKillStreamMutation()
    let [
        deleteStream, {
            isLoading: isDeletingStream,
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
            error: deleteError
        }] = useDeleteStreamMutation()

    // toast messages
    useEffect(() => {
        if (isDownloadSuccess) {
            console.log(`Download of stream for Video File: ${videoFileId} has begun...`)
        }
        if (isDownloadError) {
            let msg = 'Error downloading video stream: ' + getToastMessage(downloadError)
            toast.error(msg)
        }
        if (isKillSuccess) {
            toast('Successfully killed stream');
        }
        if (isKillError) {
            let msg = 'Error killing stream: ' + getToastMessage(killError);
            toast.error(msg);
        }
        if (isDeleteSuccess) {
            toast('Successfully deleted stream data')
        }
        if (isDeleteError) {
            let msg = 'Error deleting stream data: ' + getToastMessage(deleteError)
            toast.error(msg)
        }
    }, [
        isDownloadSuccess, isDownloadError, isKillSuccess, isKillError, killError, isDeleteSuccess,
        downloadError, isDeleteError, deleteError, videoFileId,
    ])

    // components
    return (
        <>
            <ConfirmationModal
                title={'Confirm: Stop video stream'}
                verb={'Stop'}
                isShown={isConfirmKillStreamShown}
                onCancel={onCancelStopStream}
                onConfirm={onConfirmStopStream}>
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
            <ConfirmationModal
                title={'Confirm: Delete video data'}
                isShown={isConfirmDeleteStreamShown}
                onCancel={onCancelDeleteStream}
                onConfirm={onConfirmDeleteStream}>
                <img src="/img/icon/warning/warning_128.png" alt="Warning"/>
                <div>
                    <div className="Video-source-confirm-message">
                        <span>Are you sure you want to delete this video data?</span>
                        <strong style={{color: '#666'}}>
                            You will need to re-download it if you wish<br/> to view it in the future.
                        </strong>
                    </div>
                </div>
            </ConfirmationModal>

            <div className="Video-file-display">
                {
                    isKillingStream || isDeletingStream ?
                        <SmallSpinner
                            size={'23px'}
                            style={{margin: '.25rem 1.5rem .25rem .5rem', width: '23px'}}/> :
                        <StatusBubble
                            status={videoStreamStatus}
                            progress={completionRatio}
                            style={{marginRight: '1rem'}}
                        />
                }
                <div>
                    <div style={{display: 'flex'}}>
                    <span style={{width: '5rem'}}>
                        {videoFile.title}
                    </span>
                        <br/>
                        <div className="Video-file-controls-container">
                            {
                                videoStreamStatus <= JobStatus['CREATED'] ?
                                    <button onClick={() => onStartStream(links['video-stream'].href)}>
                                        <img src={'/img/icon/download/download_16.png'} alt="Begin streaming"/>
                                    </button> :
                                    null
                            }
                            {
                                videoStreamStatus === JobStatus['BUFFERING'] ||
                                videoStreamStatus === JobStatus['QUEUED'] ||
                                videoStreamStatus === JobStatus['STREAMING'] ?
                                    <button onClick={onStopStream}>
                                        <img src={'/img/icon/stop/stop_16.png'} alt="Stop streaming"/>
                                    </button> :
                                    null
                            }
                            {
                                videoStreamStatus === JobStatus['ERROR'] ||
                                videoStreamStatus === JobStatus['STOPPED'] ||
                                videoStreamStatus === JobStatus['COMPLETED'] ?
                                    <button onClick={() => onDeleteStream(videoFileId)}
                                            className="Video-source-extra-control delete">
                                        <img src={'/img/icon/delete/delete_16.png'} alt="Delete stream"/>
                                    </button> :
                                    null
                            }
                        </div>
                    </div>
                    {
                        videoStreamStatus === JobStatus['ERROR'] ?
                            <button className="Error-modal-button" onClick={onShowErrorModal}>
                                Show error details
                            </button> :
                            <span className="Video-file-url">{videoFile['externalUrl']}</span>
                    }
                </div>
                <VideoStreamingErrorDisplay
                    isShown={isErrorModalShown}
                    onHide={onHideErrorModal}
                    error={streamStatus?.error}/>
            </div>
        </>
    );
}
