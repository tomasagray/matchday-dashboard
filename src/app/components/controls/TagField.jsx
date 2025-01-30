import React, {useRef, useState} from "react";
import {useCaptureEnterPressed} from "../../hooks/useCaptureEnterPressed";
import {ID_PREFIX} from "./Tag";

export const TagField = (props) => {

    // handlers
    const onClickField = () => {
        editor.current?.focus()
    }
    const onFocusEditor = () => {
        setIsEditorFocused(true)
    }
    const onBlurEditor = () => {
        setIsEditorFocused(false)
    }
    const onTagModified = (e) => {
        onEditTag && onEditTag(e.target.value)
    }
    const onBeginDrag = (id) => {
        setDragging(id)
    }
    const onTagDragOver = (drag) => {
        if (drag.id === dragging)
            throw ReferenceError('Same item')

        let currentPos = ids.indexOf(dragging)
        let dragPos = ids.indexOf(drag.id)
        let requestedPos = drag.isBefore ? dragPos : dragPos + 1
        let editDistance = requestedPos - currentPos

        if (requestedPos === -1 || (editDistance >= 0 && editDistance <= 1)) {
            setRequestedPosition(-1)
            throw ReferenceError('Effectively same position');
        }

        setRequestedPosition(requestedPos)
    }
    const onDragExit = () => {
        // setRequestedPosition(-1)
    }
    const onDrop = () => {
        if (requestedPosition === -1) return

        let currentPosition = ids.indexOf(dragging)
        onMoveTag && onMoveTag(currentPosition, requestedPosition)

        // reset for next drag
        setRequestedPosition(-1)
    }

    // state
    let {children, editorValue, onEditTag, onAddTag, onMoveTag} = props
    let ids = children?.map(child => ID_PREFIX + child.key)
    let [isEditorFocused, setIsEditorFocused] = useState(false)
    let [dragging, setDragging] = useState({})
    let [requestedPosition, setRequestedPosition] = useState(-1)

    // hooks
    const editor = useRef()
    useCaptureEnterPressed({
        isFocused: isEditorFocused,
        action: onAddTag,
        ref: editor,
    })

    let additionalProps = {
        onBeginDrag: onBeginDrag,
        onDragOver: onTagDragOver,
        onDragExit,
        onDrop,
        isDraggable: onMoveTag != null,
    }

    return (
        <div className="Tag-field" onClick={onClickField}>
            <div className="Tags-container">
                {
                    React.Children.map(children,
                        child => React.cloneElement(child, additionalProps))
                }
                <input className="Tag-editor"
                       type="text" value={editorValue ?? ''} ref={editor}
                       size={editorValue?.length > 0 ? editorValue.length : 1}
                       onFocus={onFocusEditor} onBlur={onBlurEditor} onChange={onTagModified}
                />
            </div>
        </div>
    )
}
