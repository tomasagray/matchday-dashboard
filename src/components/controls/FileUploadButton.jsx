import React from "react";
import {ClearButton} from "./ClearButton";

export const FileUploadButton = (props) => {

    let {value, accept, onChange, onClear} = props
    let clearButton = value ? <ClearButton onClick={onClear}/> : null

    return (
        <div className={"File-upload"}>
            <label className={"File-upload-button"}>
                <img src={process.env.PUBLIC_URL + '/img/icon/upload/upload_32.png'} alt={'Upload'}/>
                Upload
                <input type={"file"} name="new-user-cookies" onChange={onChange} accept={accept}/>
            </label>
            <p className={"File-path"}>{value}</p>
            {clearButton}
        </div>
    )
}
