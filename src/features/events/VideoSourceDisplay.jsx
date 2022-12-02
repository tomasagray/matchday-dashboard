import React from "react";
import {VideoFileDisplay} from "./VideoFileDisplay";
import {useSelector} from "react-redux";
import {selectVideoSourceById} from "../video/videoSourceSlice";
import _ from 'underscore';
import {StatusBubble} from "../../components/StatusBubble";

export const VideoSourceDisplay = (props) => {

    // state
    let {videoSourceId, onSelect, onHide, isSelected} = props
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
    } = videoSource
    console.log('videoSource', status, completionRatio)

    let parts = Object.values(videoFiles)
    let className = "Video-source-display" + (isSelected ? ' selected' : '')

    return (
        <div className={className} onClick={onSelect}>
            <div className="Video-source-display-header">
                <h3 style={{marginRight: '1rem'}}>{channel}</h3>
                <StatusBubble status={status} progress={completionRatio} />
            </div>
            <div className="Video-source-metadata-fields">
                {/* todo - get flag for language */}
                <span>{languages}</span>
                <span>{duration}</span>
            </div>
            <div className="Video-file-container">
                {
                    parts.map(part => <VideoFileDisplay key={part['videoFileId']} videoFile={part} />)
                }
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
