import React, {useEffect, useState} from "react";
import {StatusBubble} from "../../components/StatusBubble";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {JobStatus} from "../../slices/videoSourceSlice";
import {
  useDeleteStreamMutation,
  useKillStreamMutation
} from "../../slices/api/videoSourceApiSlice";
import {toast} from "react-toastify";
import {getToastMessage} from "../../app/utils";
import {SmallSpinner} from "../../components/Spinner";

export const VideoFileDisplay = (props) => {

    // handlers
    const onStopStream = async (videoFileId) => {
        console.log('killing video stream...', videoFileId)
        await killStream({eventId, videoFileId})
        console.log('done killing stream')
    }
    const onDeleteStream = async (videoFileId) => {
        console.log('deleting video stream data...', videoFileId)
        await deleteStream({eventId, videoFileId})
        console.log('done deleting data')
    }

    // state
    let {
        videoFile,
        eventId,
        onUpdateStream,
        onStartStream,
     } = props
    let {videoFileId} = videoFile
    const [streamStatus, setStreamStatus] = useState({})

    // hooks
    useSubscription('/status/video-stream', (msg) => {
        let status = JSON.parse(msg.body)
        if (videoFileId === status['videoFileId']) {
            setStreamStatus(status)
            onUpdateStream(status)
        }
    })
    const stompClient = useStompClient()
    useEffect(() => {
        if (stompClient) {
            stompClient.publish({
                destination: '/api/ws/streams/status',
                body: JSON.stringify(videoFileId)
            })
        }
    }, [stompClient, videoFile, videoFileId])
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
        if (isKillSuccess) {
            toast('Successfully killed stream')
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
        isKillSuccess, isKillError, killError, isDeleteSuccess,
        isDeleteError, deleteError,
    ])

    // components
    let videoStreamStatus = JobStatus[streamStatus['status']] ?? JobStatus['CREATED']
    return (
        <div className="Video-file-display">
            {
                isKillingStream || isDeletingStream ?
                    <SmallSpinner
                        size={'23px'}
                        style={{margin: '.25rem 1.5rem .25rem .5rem', width: '23px'}} /> :
                    <StatusBubble
                        progress={streamStatus['completionRatio']}
                        status={streamStatus['status']}
                        style={{marginRight: '1rem'}}
                    />
            }
            <div>
                <div style={{display: 'flex'}}>
                    {videoFile.title} <br/>
                    <div className="Video-file-controls-container">
                        {
                            videoStreamStatus <= JobStatus['CREATED'] ?
                                <button onClick={() => onStartStream(videoFileId)}>
                                    <img src={'/img/icon/download/download_16.png'} alt="Begin streaming" />
                                </button> :
                                null
                        }
                        {
                            videoStreamStatus === JobStatus['BUFFERING'] || videoStreamStatus === JobStatus['STREAMING'] ?
                                <button onClick={() => onStopStream(videoFileId)}>
                                    <img src={'/img/icon/stop/stop_16.png'} alt="Stop streaming" />
                                </button> :
                                null
                        }
                        {
                            videoStreamStatus === JobStatus['ERROR'] ||
                            videoStreamStatus === JobStatus['STOPPED'] ||
                            videoStreamStatus === JobStatus['COMPLETED'] ?
                                <button onClick={() => onDeleteStream(videoFileId)} className="Video-source-extra-control delete">
                                    <img src={'/img/icon/delete/delete_16.png'} alt="Delete stream" />
                                </button> :
                                null
                        }
                    </div>
                </div>
                <span className="Video-file-url">{videoFile['externalUrl']}</span>
            </div>
        </div>
    );
}
