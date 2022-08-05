import React, {useRef} from "react";
import {useFetchVideoPlaylistQuery} from "./videoSourceApiSlice";
import 'video.js/dist/video-js.css';
import {VideoJsWrapper} from "./VideoJsWrapper";


export const VideoPlayer = (props) => {

    const onPlayerReady = (player) => {
        playerRef.current = player
        console.log('player duration', player.duration())
        player.on('waiting', () => {
            console.log('player is waiting')
        })
        player.on('dispose', () => {
            console.log('player is being disposed')
        })
    }

    const playerRef = useRef(null)
    const {src, hidden} = props
    const {
        data: videoSources,
        isSuccess,
        isError,
        error
    } = useFetchVideoPlaylistQuery(src, {skip: src === null})
    if (isError) {
        console.error(error)
    }

    let video
    if (isSuccess) {
        const sources = Object.values(videoSources['uris'])
            .map((uri) => {
                return {
                    src: uri.uri,
                    type: 'application/x-mpegURL'
                }
            })
        let videoJsOptions = {
            autoplay: true,
            controls: true,
            responsive: true,
            fluid: true,
            bigPlayButton: true,
            sources,
        }
        video = <VideoJsWrapper options={videoJsOptions} onReady={onPlayerReady} />
    }

    return (
        <div className="Video-player-modal" style={{display: hidden ? 'none' : 'flex'}}>
            <div className="Video-player-container">
                {video}
            </div>
        </div>
    )
}
