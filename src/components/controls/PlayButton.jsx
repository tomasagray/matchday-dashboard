import React from "react";

export const PlayButton = (props) => {

    const {onClick, disabled} = props

    return (
        <button className="Play-button" onClick={onClick} disabled={disabled}>
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <title>play</title>
                <polygon points="32 16 16 24 0 32 0 16 0 0 16 8 32 16"/>
            </svg>
            PLAY
        </button>
    )
}
