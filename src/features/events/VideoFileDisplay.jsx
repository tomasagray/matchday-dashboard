import React from "react";
import {StatusBubble} from "../../components/StatusBubble";

export const VideoFileDisplay = (props) => {

    // state
    let {videoFile, onStartStream, onStopStream, onDeleteStream} = props

    return (
        <div className="Video-file-display">
            <StatusBubble
                progress={0.75}
                isError={false}
                style={{marginRight: '1rem'}}
            />
            {videoFile.title}
            <div className="Video-file-controls-container">
                <button onClick={onStartStream}>
                    <img src={'/img/icon/download/download_16.png'} alt="Begin streaming" />
                </button>
                <button onClick={onStopStream}>
                    <img src={'/img/icon/stop/stop_16.png'} alt="Stop streaming" />
                </button>
                <button onClick={onDeleteStream}>
                    <img src={'/img/icon/delete/delete_16.png'} alt="Delete stream" />
                </button>
            </div>
        </div>
    )
}
