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
    let {value, accept, onChange, onClear} = props
    let clearButton = value ? <ClearButton onClick={onClearFile}/> : null
    const ref = useRef()

    return (
        <div className={"File-upload"}>
            <label className={"File-upload-button"}>
                <img src={process.env.PUBLIC_URL + '/img/icon/upload/upload_32.png'} alt={'Upload'}/>
                Upload
                <input
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
