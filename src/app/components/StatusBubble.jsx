import React from "react";
import properties from "../properties";
import {JobStatus} from "../slices/videoSourceSlice";

export const StatusBubble = (props) => {

    const size = 32
    const radius = 12
    const stroke = 2 * Math.PI * radius
    const primaryColor = properties.primaryColor

    // state
    let {style, progress = 0, status = JobStatus['CREATED']} = props
    let isError = status === JobStatus['ERROR'];
    let isStopped = status === JobStatus['STOPPED']
    let isQueued = status === JobStatus['QUEUED']
    let isStreaming = status === JobStatus['STARTED']
        || status === JobStatus['BUFFERING']
        || status === JobStatus['STREAMING']
    let isComplete = status === JobStatus['COMPLETED']

    let fill = (stroke * progress) - stroke
    let bubbleStyle = {
        transform: 'rotate(90deg) scaleX(-1)',
        strokeDasharray: stroke,
        strokeDashoffset: fill,
    }

    // elements
    const progressStyle = {
        position: "absolute",
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    let progressRatio = Math.round(progress * 100)

    let strokeWidth = status === JobStatus['CREATED'] ? 1 : 3
    let bubbleColor =
        isError ? 'red' :
            isStopped ? 'yellow' :
                isQueued || isStreaming || isComplete ? primaryColor
                    : 'transparent'
    let bubbleText =
        isError ? 'X' :
            isStopped ? '!' :
                isQueued || isStreaming ? `${progressRatio}%`
                    : ''

    return (
        <div className="Status-bubble" style={style}>
            {
                isError ?
                    <img src={'/img/icon/error/error_32.png'} alt="Error" width={size * .75}/> :
                    <>
                        {/* background circle */}
                        <svg height={size} width={size} style={{position: 'absolute'}}>
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke="#666"
                                strokeWidth={strokeWidth}
                                fill="transparent"
                            />
                        </svg>
                        {/* progress meter */}
                        <svg height={size} width={size} style={bubbleStyle}>
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={bubbleColor}
                                strokeWidth={strokeWidth}
                                fill={isComplete ? bubbleColor : 'transparent'}
                            />
                        </svg>
                        {/* progress indicator */}
                        <div style={progressStyle}>
                            {
                                isError || isStopped ?
                                    <span style={{fontWeight: 'bold', color: bubbleColor}}>
                                        {bubbleText}
                                    </span> :
                                    isStreaming || isQueued ?
                                        <span style={{fontSize: '6pt'}}>
                                        {bubbleText}
                                    </span> :
                                        isComplete ?
                                            <span style={{fontWeight: 'bold', color: 'black'}}>
                                        &#10003;
                                    </span> :
                                            null
                            }
                        </div>
                    </>
            }
        </div>
    )
}
