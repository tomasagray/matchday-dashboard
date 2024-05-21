import React, {useRef} from "react";
import {ClearButton} from "./ClearButton";

export const FileUploadButton = (props) => {

    // handlers
    const onUploadFile = async (e) => {
        onChange && await onChange(e)
        ref.current.value = ''
    }

    const onClearFile = (e) => {
        e.preventDefault()
        onClear && onClear(e)
    }

    // state
    let {value, accept, onChange, onClear, style} = props
    let clearButton = value ? <ClearButton onClick={onClearFile}/> : null
    const ref = useRef()

    return (
        <div className={"File-upload"} style={style}>
            <label className={"File-upload-button"}>
                <span style={{marginRight: '1rem'}}>Upload</span>
                <img src={'/img/icon/upload/upload_32.png'} alt={'Upload'}/>
                <input
                    style={{display: 'none'}}
                    type={"file"}
                    ref={ref}
                    name="new-user-cookies"
                    onChange={onUploadFile}
                    accept={accept}
                />
            </label>
            <p className={"File-path"}>{value}</p>
            {clearButton}
        </div>
    )
}
