import React from "react";
import {VideoFileDisplay} from "./VideoFileDisplay";
import {useSelector} from "react-redux";
import {selectVideoSourceById} from "../video/videoSourceSlice";
import _ from 'underscore';
import {StatusBubble} from "../../components/StatusBubble";

export const VideoSourceDisplay = (props) => {

    // handlers
    const handlePlayVideoSource = () => {
        let {stream} = links
        console.log('playing stream at', stream.href)
        onPlay && onPlay(stream.href)
    }
    const onStopAllStreams = () => {
        console.log('stop all video streams here...')
    }
    const onDeleteAllStreams = () => {
        console.log('delete all video data here...')
    }
    const onDownloadStream = (id) => {
        console.log('start downloading stream here...', id)
    }
    const onStopStream = (id) => {
        console.log('stop single video stream here', id)
    }
    const onDeleteStream = (id) => {
        console.log('delete a single video stream here...', id)
    }

    // state
    let {
        videoSourceId,
        isSelected,
        onSelect,
        onHide,
        onPlay,
    } = props
    // prevent infinite re-renders using _.isEqual
    let videoSource = useSelector(state => selectVideoSourceById(state, videoSourceId), _.isEqual)
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
        status,
        completionRatio,
        _links: links,
    } = videoSource

    let parts = Object.values(videoFiles)
    let className = "Video-source-display" + (isSelected ? ' selected' : '')

    return (
        <div className={className} onClick={onSelect}>
            <div className="Video-source-display-header">
                <h3 style={{marginRight: '1rem'}}>{channel}</h3>
                <div className="Video-source-controls-container">
                    <StatusBubble status={status} progress={completionRatio} />
                    <button className="Video-source-play-button" onClick={handlePlayVideoSource}>
                        <img src="/img/icon/play/play_16.png" alt="Play" />
                    </button>
                    <button onClick={onStopAllStreams} className="Video-source-extra-control">
                        <img src={'/img/icon/stop/stop_16.png'} alt="Stop streaming" />
                    </button>
                    <button onClick={onDeleteAllStreams} className="Video-source-extra-control">
                        <img src={'/img/icon/delete/delete_16.png'} alt="Delete stream" />
                    </button>
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
                                onStartStream={onDownloadStream}
                                onStopStream={onStopStream}
                                onDeleteStream={onDeleteStream}
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
