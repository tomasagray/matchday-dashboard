import React from "react";

export const StatusBubble = (props) => {

    const size = 32
    const radius = 12
    const stroke = 2 * Math.PI * radius
    const primaryColor = '#6e86ff'

    // state
    let {style, progress = 0, status} = props
    let isError = status === 'ERROR';
    let isStopped = status === 'STOPPED'
    let isQueued = status === 'CREATED' || status === 'QUEUED'
    let isStreaming = status === 'STARTED' || status === 'BUFFERING' || status === 'STREAMING'
    let isComplete = status === 'COMPLETED'

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

    let strokeWidth = !status ? 1 : 3
    let bubbleColor =
        isError ? 'red' :
            isStopped ? 'yellow' :
                isStreaming || isComplete ? primaryColor
        : 'transparent'
    let bubbleText =
        isError ? 'X' :
            isStopped ? '!' :
                isStreaming ? `${progressRatio}%`
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
                                fill={bubbleColor}
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
