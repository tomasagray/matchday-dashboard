import React from "react";
import Select from "../../components/controls/Select";
import {AddButton} from "../../components/controls/AddButton";
import {ClearButton} from "../../components/controls/ClearButton";
import {Option} from "../../components/controls/Option";
import {useDispatch} from "react-redux";
import {PartIdentifier, videoFileAdded, videoFileDeleted, videoFileUpdated} from "../../slices/videoSourceSlice";


export const VideoFileEditor = (props) => {

    // handlers
    const dispatch = useDispatch()
    const onSelectPart = (e, value) => {
        let vf = {
            ...videoFile,
            title: {
                value,
                valid: value !== ''
            },
        }
        dispatch(videoFileUpdated(vf))
    }
    const onUpdateVideoFileUrl = (e) => {
        let value = e.target.value
        let vf = {
            ...videoFile,
            externalUrl: {
                value,
                valid: value !== ''
            }
        }
        dispatch(videoFileUpdated(vf))
    }
    const onAddVideoFile = () => {
        dispatch(videoFileAdded())
    }
    const onDeleteVideoFile = () => {
        dispatch(videoFileDeleted(videoFile))
    }

    // state
    let {videoFile} = props

    return (
        <div className="Video-file-editor">
            <Select
                onChange={onSelectPart}
                selectedValue={videoFile.title.value}
                style={{width: '15rem', borderColor: (videoFile.title.valid ? '' : 'red')}}
                placeholder="SELECT PART">
                {
                    Object.keys(PartIdentifier).map(part =>
                        <Option value={part} key={'Video-file-part-' + part}>{part}</Option>
                    )
                }
            </Select>
            <input
                type="url"
                id={"Video-file-url" + videoFile.videoFileId}
                className={videoFile.externalUrl.valid ? '' : 'invalid'}
                value={videoFile.externalUrl.value}
                onChange={onUpdateVideoFileUrl}
                placeholder="https://..."
                style={{width: '100%'}}/>
            <div style={{display: 'flex', alignItems: 'baseline'}}>
                <ClearButton onClick={onDeleteVideoFile}/>
                <AddButton onClick={onAddVideoFile}/>
            </div>
        </div>
    )
}