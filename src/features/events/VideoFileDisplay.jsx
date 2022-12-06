import React, {useEffect, useState} from "react";
import {StatusBubble} from "../../components/StatusBubble";
import {useStompClient, useSubscription} from "react-stomp-hooks";

export const VideoFileDisplay = (props) => {

    // state
    let {
        videoFile,
        onUpdateStream,
        onStartStream,
        onStopStream,
        onDeleteStream
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

    return (
        <div className="Video-file-display">
            <StatusBubble
                progress={streamStatus['completionRatio']}
                status={streamStatus['status']}
                style={{marginRight: '1rem'}}
            />
            <div>
                <div style={{display: 'flex'}}>
                    {videoFile.title} <br/>
                    <div className="Video-file-controls-container">
                        <button onClick={() => onStartStream(videoFileId)}>
                            <img src={'/img/icon/download/download_16.png'} alt="Begin streaming" />
                        </button>
                        <button onClick={() => onStopStream(videoFileId)}>
                            <img src={'/img/icon/stop/stop_16.png'} alt="Stop streaming" />
                        </button>
                        <button onClick={() => onDeleteStream(videoFileId)}>
                            <img src={'/img/icon/delete/delete_16.png'} alt="Delete stream" />
                        </button>
                    </div>
                </div>
                <span className="Video-file-url">{videoFile['externalUrl']}</span>
            </div>

        </div>
    );
}
