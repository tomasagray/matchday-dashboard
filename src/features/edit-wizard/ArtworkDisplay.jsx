import React from "react";

export const ArtworkDisplay = (props) => {

    const onClickHandler = () => {
        onClick && onClick(artwork)
    }

    let {artwork, className, onClick} = props
    let {_links: links} = artwork
    return (
        <div className={`Artwork-display ${className}`} onClick={onClickHandler}>
            <img src={links['image']['href']} alt="" key={artwork.id}/>
        </div>
    )
}
