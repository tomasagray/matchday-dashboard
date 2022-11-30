import React from "react";

export const StatusBubble = (props) => {

    const size = 32
    const radius = 12
    const stroke = 2 * Math.PI * radius
    const primaryColor = '#6e86ff'

    // state
    let {style, progress, isError} = props
    let isComplete = progress === 1

    let fill = (stroke * progress) - stroke
    let fillColor = isComplete ? primaryColor : 'transparent'
    let bubbleStyle = {
        transform: 'rotate(90deg) scaleX(-1)',
        strokeDasharray: stroke,
        strokeDashoffset: fill,
    }
    let progressStyle = {
        position: "absolute",
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    return (
        <div className="Status-bubble" style={style}>
            {
                isError ?
                    <img src={'/img/icon/error/error_32.png'} alt="Error" width={size * .75}/> :
                    <>
                        <svg height={size} width={size} style={{position: 'absolute'}}>
                            <circle cx={size / 2} cy={size / 2} r={radius} stroke="#666" strokeWidth="3" fill="transparent"/>
                        </svg>
                        <svg height={size} width={size} style={bubbleStyle}>
                            <circle cx={size / 2} cy={size / 2} r={radius} stroke={primaryColor} strokeWidth="3" fill={fillColor}/>
                        </svg>
                        <div style={progressStyle}>
                            {
                                isComplete ?
                                    <span style={{fontWeight: 'bold'}}>&#10003;</span> :
                                    <span style={{fontSize: '6pt'}}>{progress * 100}%</span>
                            }
                        </div>
                    </>
            }
        </div>
    )
}
