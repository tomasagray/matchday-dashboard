import React, {useEffect, useState} from "react";
import ReactSlider from "react-slider";

const formatTime = (milliseconds) => {
    if (milliseconds === undefined || milliseconds === null || isNaN(milliseconds)) {
        return '0:00'
    } else if (milliseconds >= 3600) {
        return new Date(milliseconds * 1000).toISOString().substring(11,19);
    } else {
        return new Date(milliseconds * 1000).toISOString().substring(14,19);
    }
}

export const VideoPlayer = (props) => {

    const onEnterFullscreen = () => {
        console.log('full screen')
    }
    const onNext = () => {
        console.log('next')
    }
    const onPrev = () => {
        console.log('previous')
    }
    const onPlay = async () => {
        if (isPlaying) {
            videoPlayer.pause()
            setIsPlaying(false)
        } else {
            videoPlayer.play()
            setIsPlaying(true)
        }
    }
    const onStop = () => {
        videoPlayer.pause()
        setIsPlaying(false)
        videoPlayer.currentTime = 0
        onClose()
    }
    const onChangeVideoTime = (e) => {
        videoPlayer.currentTime = (e / 100) * videoPlayer.duration
    }
    // audio controls
    const onChangeVolume = (e) => {
        if (e >= 0 && e <= 100) {
            videoPlayer.volume = (100 - e) / 100
        } else {
            videoPlayer.volume = 0
            console.error('Irrational volume value received: ', e)
        }
    }

    const videoPlayer = document.getElementById('Video-player')
    const {title, subtitle, hidden, onClose} = props
    let [isPreviousDisabled] = useState(true)
    let [isNextDisabled] = useState(true)
    let [isPlaying, setIsPlaying] = useState(false)
    let [currentTime, setCurrentTime] = useState(0)

    // update video time slider
    useEffect(() => {
        const interval = setInterval(() => {
            if (videoPlayer) {
                // compute current time as %
                let time = Math.round((videoPlayer.currentTime / videoPlayer.duration) * 100);
                if (time === 100) {
                    videoPlayer.pause()
                    videoPlayer.currentTime = 0
                    setIsPlaying(false)
                }
                setCurrentTime(time)
            }
        }, 25)
        return () => clearInterval(interval)
    }, [videoPlayer])
    const currentTimeDisplay = formatTime(videoPlayer?.currentTime)
    const durationDisplay = formatTime(videoPlayer?.duration)

    // TODO: get the real playlist URL
    const videoSrc = 'https://www.w3schools.com/html/mov_bbb.mp4'

    return (
        <div className="Video-player-modal" style={{display: hidden ? 'none' : 'flex'}}>
            <div className="Video-controls top">
                <button className="Full-screen-button" onClick={onEnterFullscreen}>
                    <img src={process.env.PUBLIC_URL + '/img/icon/full-screen/full-screen_32.png'} alt="Fullscreen"/>
                </button>
            </div>

            <div className="Video-player-container">
                <video className="Video-player" crossOrigin="anonymous" id="Video-player"
                       src={videoSrc} onClick={onPlay} />
            </div>

            <div className="Video-spinner-container">
                {
                    !isPlaying ?
                        <button className="Video-player-main-play-button" onClick={onPlay}>
                            <img src={process.env.PUBLIC_URL + '/img/icon/play/play_64.png'} alt="Play" />
                        </button> :
                        null
                }
            </div>

            <div className="Video-controls bottom">
                <div style={{width: '100%', position: 'fixed', left: 0, transform: 'translateY(-3.75rem)'}}>
                    <ReactSlider
                        value={currentTime}
                        onChange={onChangeVideoTime}
                        className="Video-player-time-control"
                        trackClassName="Video-player-time-track"
                        thumbClassName="Video-player-time-thumb"
                    />
                </div>

                <div className="Video-control-container">
                    <div className="Video-metadata-container">
                        <span className="Video-title">{title}</span>
                        <span className="Video-subtitle">{subtitle}</span>
                        <div className="Video-time-container">
                            <div id="Video-current-time">{currentTimeDisplay}</div>
                            <div style={{color: '#aaa', fontWeight: 'bolder'}}>/</div>
                            <div id="Video-duration">{durationDisplay}</div>
                        </div>
                    </div>
                    <div className="Video-player-controls">
                        <button className="Video-player-control-button" onClick={onPrev} disabled={isPreviousDisabled}>
                            <img src={process.env.PUBLIC_URL + '/img/icon/next/next_16.png'} alt="Previous"
                                 style={{transform: "scaleX(-1)"}} />
                        </button>
                        <button className="Video-player-control-button play" onClick={onPlay}>
                            {
                                isPlaying ?
                                    <img src={process.env.PUBLIC_URL + '/img/icon/pause/pause_16.png'} alt="Pause" /> :
                                    <img src={process.env.PUBLIC_URL + '/img/icon/play/play_16.png'} alt="Play" />
                            }
                        </button>
                        <button className="Video-player-control-button" onClick={onNext} disabled={isNextDisabled}>
                            <img src={process.env.PUBLIC_URL + '/img/icon/next/next_16.png'} alt="Next" />
                        </button>
                        <button className="Video-player-control-button" onClick={onStop}>
                            <img src={process.env.PUBLIC_URL + '/img/icon/stop/stop_16.png'} alt="Stop"/>
                        </button>
                    </div>
                    <div className="Audio-controls">
                        <img src={process.env.PUBLIC_URL + '/img/icon/audio/audio_16.png'} alt="Volume" />
                        <ReactSlider
                            onChange={onChangeVolume}
                            className="Video-player-volume-control"
                            trackClassName="Video-player-volume-track"
                            thumbClassName="Video-player-volume-thumb"
                            orientation="vertical" />
                    </div>
                </div>
            </div>
        </div>
    )
}
