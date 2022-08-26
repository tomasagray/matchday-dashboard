import React, {useEffect, useRef, useState} from "react";
import {ClearButton} from "./ClearButton";

export const TagField = (props) => {

    // handlers
    const onClickField = () => {
        editor.current && editor.current.focus()
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

    const editor = useRef()
    useEffect(() => {
        // listen for 'enter' button when using editor
        const listener = (e) => {
            const value = e.target.value
            let isValueValid = value !== ''
            let isEnterButton = e.code === 'Enter' || e.code === 'NumpadEnter'
            if (isValueValid && isEnterButton && isEditorFocused) {
                e.preventDefault()
                onAddTag(value)
                if (editor.current) {
                    editor.current.blur()
                }
            }
        }
        document.addEventListener('keydown', listener)
        return () => document.removeEventListener('keydown', listener)
    }, [isEditorFocused, onAddTag])

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
        onDelete && onDelete(children)
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
