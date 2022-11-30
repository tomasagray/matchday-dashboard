import React from "react";
import {VideoFileDisplay} from "./VideoFileDisplay";

export const VideoSourceDisplay = (props) => {

    // state
    let {videoSource, onHide} = props
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
    } = videoSource
    let parts = Object.values(videoFiles)

    return (
        <div className="Video-source-display">
            <h3>{channel}</h3>
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
                <span>{source}</span>
                <span>{mediaContainer}</span>
                <span>{audioCodec}</span>
            </div>
            <div className="Video-source-display-close-button">
                <button className={"Close-button"} onClick={onHide}></button>
            </div>
        </div>
    )
}
