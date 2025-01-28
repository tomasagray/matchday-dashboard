import React from "react";
import {ClearButton} from "./ClearButton";


export const ID_PREFIX = 'Tag-container_'

export const Tag = (props) => {

    const getMidpoint = (elem) => {
        if (!elem) return

        const rect = elem.getBoundingClientRect()
        return ((rect.right - rect.left) / 2) + rect.left
    }
    const clearPreviews = () => {
        for (let i = 0; i < tags.length; i++) {
            tags[i].classList.remove('drag-over-before', 'drag-over-after')
        }
    }

    // handlers
    const onDeleteTag = () => {
        onDelete && onDelete()
    }
    const onDragStart = () => onBeginDrag && onBeginDrag(id)
    const onDragEnter = (elem, e) => {
        if (!elem) return

        try {
            if (e.clientX > midpoint) {
                onDragOver && onDragOver({id: elem.id, isBefore: false})
                elem.classList.remove('drag-over-before')
                elem.classList.add('drag-over-after')
            } else {
                onDragOver && onDragOver({id: elem.id, isBefore: true})
                elem.classList.remove('drag-over-after')
                elem.classList.add('drag-over-before')
            }
        } catch (e) {
            // console.error(e.toString())
        }
    }
    const onDragExit = (elem) => {
        if (!elem) return
        exitHandler && exitHandler()
        clearPreviews()
    }
    const onDragEnd = () => {
        onDrop && onDrop()
        clearPreviews()
    }

    // state
    let {
        children,
        onDelete,
        onBeginDrag,
        onDragOver,
        onDragExit: exitHandler,
        onDrop,
        isDraggable,
    } = props
    let id = ID_PREFIX + children.toString()
    const elem = document.getElementById(id)
    const tags = document.getElementsByClassName('Tag-container')
    let midpoint = getMidpoint(elem)

    return (
        <div
            id={id}
            className={'Tag-container' + (isDraggable ? ' draggable' : '')}
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragEnter={(e) => onDragEnter(elem, e)}
            onDragExit={() => onDragExit(elem)}>
            <p className="Tag">
                {children}
            </p>
            <ClearButton onClick={onDeleteTag}/>
        </div>
    )
}