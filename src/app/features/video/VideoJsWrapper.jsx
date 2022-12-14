import React from "react";
import {useVideoJS} from "react-hook-videojs";

export const VideoJsWrapper = (props) => {

    const {options, onReady} = props
    const className = 'React-Hook-Video-js'
    const { Video, player, ready} = useVideoJS(options, className)
    if (ready) {
        onReady && onReady(player)
    }
    return (
        <>
            <Video />
        </>
    )
}
