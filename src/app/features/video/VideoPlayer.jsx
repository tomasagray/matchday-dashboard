import React, {useEffect, useRef, useState} from "react";
import {useFetchVideoPlaylistQuery} from "../../slices/api/videoSourceApiSlice";
import 'video.js/dist/video-js.css';
import {VideoJsWrapper} from "./VideoJsWrapper";
import {formatTime, getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import ReactSlider from 'react-slider';

const computePlayerPosition = (current, duration) => {
    if (current === 0 || duration === 0) {
        return 0
    }
    return current / duration
}

export const VideoPlayer = (props) => {

    const REWIND_SKIP = 10
    const FF_SKIP = 30

    // handlers
    const onPlayerReady = (player) => {
        playerRef.current = player

        // read state
        if (isPaused) {
            player.pause()
        } else {
            player.play()
        }
        player.volume(playerVolume / 100)

        // write state
        setPlayerDuration(player.duration())
        player.on('pause', () => {
            setIsPaused(true)
        })
        player.on('play', () => {
            setIsPaused(false)
        })
        player.on('dispose', () => {
            console.log('player is being disposed...')
        })
        player.on('timeupdate', () => {
            setPlayerCurrentTime(player.currentTime())
        })
    }
    const updatePlayerTime = (updatedTime) => {
        playerRef.current.currentTime(updatedTime)
        setPlayerCurrentTime(updatedTime)
    }
    const onSetPlayerTime = (time) => {
        let updatedTime = playerDuration * time / 100
        updatePlayerTime(updatedTime)
    }
    const onPlayPause = () => {
        setIsPaused(!isPaused)
    }
    const onRewind = () => {
        if (isRewindable) {
            updatePlayerTime(playerCurrentTime - REWIND_SKIP)
        }
    }
    const onFastForward = () => {
        if (isFastForwardable) {
            updatePlayerTime(playerCurrentTime + FF_SKIP)
        }
    }
    const onPreviousSource = () => {
        if (currentSrc > 0) {
            setCurrentSrc(currentSrc - 1)
        }
    }
    const onNextSource = () => {
        if (currentSrc < (videoSources['uris'].length - 1)) {
            setCurrentSrc(currentSrc + 1)
        }
    }
    const onStopVideo = () => {
        setIsPaused(true)
        setVideoJsOptions(null)
        setCurrentSrc(0)
        setPlayerCurrentTime(0)
        onStop && onStop()
    }
    const onGoFullscreen = () => {
        playerRef.current.requestFullscreen()
    }
    // audio handlers
    const onMute = () => {
        if (!isMuted) {
            setPreviousVolume(playerVolume)
            setPlayerVolume(0)
        } else {
            setPlayerVolume(previousVolume)
        }
        setIsMuted(!isMuted)
    }
    const onSelectVolume = (volume) => {
        setPlayerVolume(volume)
        setPreviousVolume(volume)
        if (volume === 0) {
            setIsMuted(true)
        } else {
            setIsMuted(false)
        }
    }

    // state
    const {src, title, subtitle, hidden, onStop} = props
    let [videoJsOptions, setVideoJsOptions] = useState(null)
    let [currentSrc, setCurrentSrc] = useState(0)
    let [isPrevious, setIsPrevious] = useState(false)
    let [isNext, setIsNext] = useState(false)
    let [playerCurrentTime, setPlayerCurrentTime] = useState(0)
    let [playerDuration, setPlayerDuration] = useState(0)
    let [playerVolume, setPlayerVolume] = useState(100)
    let [previousVolume, setPreviousVolume] = useState(100)
    let [isMuted, setIsMuted] = useState(false)
    let [isPaused, setIsPaused] = useState(false)
    // computed state
    let playerPosition = computePlayerPosition(playerCurrentTime, playerDuration)
    let isRewindable = playerCurrentTime - REWIND_SKIP > 0
    let isFastForwardable = playerDuration - playerCurrentTime > FF_SKIP

    // hooks
    const playerRef = useRef(null)
    const {
        data: videoSources,
        isSuccess,
        isError,
        error
    } = useFetchVideoPlaylistQuery(src, {skip: src === null})

    useEffect(() => {
        if (isError) {
            let msg = 'Error loading video: ' + getToastMessage(error)
            toast.error(msg)
        }
        if (isSuccess) {
            const uris = Object.values(videoSources['uris'])
            setVideoJsOptions({
                autoplay: true,
                controls: true,
                responsive: true,
                fluid: true,
                bigPlayButton: true,
                sources: [{
                    src: uris[currentSrc].uri,
                    type: 'application/x-mpegURL',
                }],
            })
            setIsPrevious((currentSrc - 1) >= 0)
            setIsNext(currentSrc < (uris.length - 1))
        }
    }, [currentSrc, error, isError, isSuccess, videoSources])

    return (
        <div className="Video-player-modal" style={{display: hidden ? 'none' : 'flex'}}>
            <div className="Video-player-container">
                <VideoJsWrapper options={videoJsOptions} onReady={onPlayerReady} />
            </div>
            <div className="Video-player-controls-container top">
                <button className="Video-player-fullscreen-button" onClick={onGoFullscreen}>
                    <img src="/img/icon/full-screen/full-screen_16.png" alt="Fullscreen" />
                </button>
            </div>
            <div className="Video-player-controls-container bottom">
                <div className="Video-player-time-bar-container">
                    <ReactSlider
                        className="Video-player-time-bar"
                        thumbClassName="Video-player-time-thumb"
                        trackClassName="Video-player-time-track"
                        onSliderClick={onSetPlayerTime}
                        value={playerPosition * 100}
                    />
                </div>
                <div className="Video-player-info-container">
                    <strong>{title}</strong>
                    <span style={{color: 'rgba(160,160,160,.75)'}}>
                        {subtitle}
                    </span>
                    <span>
                        <span>{formatTime(playerCurrentTime)}</span> / <span>{formatTime(playerDuration)}</span>
                    </span>
                </div>
                <div className="Video-player-main-controls">
                    <button
                        className="Video-player-nav-button previous"
                        onClick={onPreviousSource}
                        disabled={!isPrevious}>
                        <img src="/img/icon/next/next_16.png" alt="Previous" />
                    </button>
                    <button
                        className="Video-player-advance-button rewind"
                        onClick={onRewind}
                        disabled={!isRewindable}>
                        <img src="/img/icon/advance/advance_16.png" alt="Rewind" />
                    </button>
                    <button className="Video-player-play-button" onClick={onPlayPause}>
                        {
                            isPaused ?
                                <img src="/img/icon/play/play_16.png" alt="Play"/> :
                                <img src="/img/icon/pause/pause_16.png" alt="Pause" />
                        }
                    </button>
                    <button
                        className="Video-player-advance-button fast-forward"
                        onClick={onFastForward}
                        disabled={!isFastForwardable}>
                        <img src="/img/icon/advance/advance_16.png" alt="Fast-forward" />
                    </button>
                    <button
                        className="Video-player-nav-button next"
                        onClick={onNextSource}
                        disabled={!isNext}>
                        <img src="/img/icon/next/next_16.png" alt="Previous" />
                    </button>
                    <button onClick={onStopVideo}>
                        <img src="/img/icon/stop/stop_16.png" alt="Stop" />
                    </button>
                </div>
                <div className="Video-player-audio-controls">
                    <button className="Video-player-mute-button" onClick={onMute}>
                        {
                            isMuted ?
                                <img src="/img/icon/mute/mute_32.png" alt="Unmute" /> :
                                <img src="/img/icon/audio/audio_32.png" alt="Volume" />
                        }
                    </button>
                    <ReactSlider
                        className="Video-player-volume-control"
                        thumbClassName="Video-player-volume-thumb"
                        trackClassName="Video-player-volume-track"
                        defaultValue={[100]}
                        value={playerVolume}
                        onSliderClick={onSelectVolume}
                    />
                </div>
            </div>
        </div>
    )
}
