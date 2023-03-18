import React, {useRef, useState} from "react";
import {ClearButton} from "./ClearButton";
import {useCaptureEnterPressed} from "../../hooks/useCaptureEnterPressed";

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

    // state
    let {children, editorValue, onEditTag, onAddTag} = props
    let [isEditorFocused, setIsEditorFocused] = useState(false)

    // hooks
    const editor = useRef()
    useCaptureEnterPressed({
        isFocused: isEditorFocused,
        action: onAddTag,
        ref: editor,
    })

    return (
        <div className="Tag-field" onClick={onClickField}>
            <div className="Tags-container">
                {children}
                <input className="Tag-editor"
                       type="text" value={editorValue ?? ''} ref={editor}
                       size={editorValue?.length > 0 ? editorValue.length : 1}
                       onFocus={onFocusEditor} onBlur={onBlurEditor} onChange={onTagModified}
                />
            </div>
        </div>
    )
}

export const Tag = (props) => {

    // handlers
    const onDeleteTag = () => {
        onDelete && onDelete()
    }
    // state
    let {children, onDelete} = props

    return (
        <div className="Tag-container">
            <p className="Tag">
                {children}
            </p>
            <ClearButton onClick={onDeleteTag} />
        </div>
    )
}
