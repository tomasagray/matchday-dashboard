import React, {useState} from "react";
import {FloatingMenu} from "../../components/FloatingMenu";

export const ArtworkDisplay = (props) => {

    // handlers
    const onClickHandler = () => {
        onClick && onClick(artwork)
    }
    const onRightClick = (e) => {
        e.preventDefault()
        setIsContextMenuHidden(false)
        setContextMenuPos(computeRelativeMousePos(e))
    }
    const onHideContextMenu = () => {
        setIsContextMenuHidden(true)
    }
    const onDeleteArtwork = () => {
        setIsContextMenuHidden(true)
        onDelete && onDelete(artwork)
    }
    // helpers
    const computeRelativeMousePos = (e) => {
        let rect = e.target.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    // state
    let {artwork, className, onClick, onDelete} = props
    let {_links: links} = artwork
    let [contextMenuPos, setContextMenuPos] = useState({x: 0, y: 0})
    let [isContextMenuHidden, setIsContextMenuHidden] = useState(true)

    // components
    const menuStyle = {
        position: 'absolute',
        top: contextMenuPos.y,
        left: contextMenuPos.x,
        zIndex: 400
    }
    return (
        <div className={`Artwork-display ${className}`} onContextMenu={onRightClick}>
            <img src={links?.image['href']} alt="" key={artwork.id} onClick={onClickHandler}/>
                <div style={menuStyle}>
                    <FloatingMenu
                        hidden={isContextMenuHidden}
                        onClickOutside={onHideContextMenu}
                        className="Artwork-delete-menu">
                    <li onClick={onDeleteArtwork}>
                        <span>Delete</span>
                        <img src={'/img/icon/delete/delete_16.png'} alt="Delete"/>
                    </li>
                </FloatingMenu>
            </div>
        </div>
    )
}
