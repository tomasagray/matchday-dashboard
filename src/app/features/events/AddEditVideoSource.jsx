import React, {useEffect} from "react";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/controls/CancelButton";
import {SaveButton} from "../../components/controls/SaveButton";
import {VideoFileEditor} from "./VideoFileEditor";
import {useDispatch, useSelector} from "react-redux";
import {
    editedVideoSourceUpdated,
    Resolution,
    selectEditedVideoSource,
    selectIsEditedVideoSourceValid,
    selectVideoSourceForUpload,
    videoSourceDialogFinished
} from "../../slices/videoSourceSlice";
import Select from "../../components/controls/Select";
import {Option} from "../../components/controls/Option";
import {useUploadVideoSourceMutation} from "../../slices/api/videoSourceApiSlice";
import {SmallSpinner} from "../../components/Spinner";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import {addVideoSource} from "../../slices/matchSlice";


const $infoMsgColor = '#888'
const InfoMessage = () => {
    const style = {
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        color: $infoMsgColor,
        fontSize: 'small',
        textAlign: 'center',
    }
    return (
        <div style={style}>
            <img style={{marginRight: '.25rem'}} src="/img/icon/info/info_32.png" alt="info"/>
            <span style={{width: '5rem'}}>All fields <br/>are required</span>
        </div>
    )
}

export const AddEditVideoSource = (props) => {

    // handlers
    const dispatch = useDispatch()
    const onUpdateField = (field, e) => {
        let value = e.target.value
        dispatch(editedVideoSourceUpdated({field, value}))
    }
    const onSelectResolution = (e, value) => {
        dispatch(editedVideoSourceUpdated({field: 'resolution', value}))
    }
    const onSelectAudioChannels = (e, value) => {
        dispatch(editedVideoSourceUpdated({field: 'audioChannels', value}))
    }
    const onSaveVideoSource = async () => {
        if (eventId === undefined || eventId === null) {
            // we're editing a new Match...
            dispatch(addVideoSource(uploadableVideoSource))
        } else {
            await uploadVideoSource({eventId, videoSource: uploadableVideoSource});
        }
        dispatch(videoSourceDialogFinished())
        onHide && onHide()
    }
    const onCancelEdit = () => {
        dispatch(videoSourceDialogFinished())
        onHide && onHide()
    }

    // state
    let {eventId, isShown, onHide} = props
    let videoSource = useSelector(state => selectEditedVideoSource(state))
    let isValid = useSelector(state => selectIsEditedVideoSourceValid(state))
    let uploadableVideoSource = useSelector(state => selectVideoSourceForUpload(state))

    // hooks
    let [
        uploadVideoSource, {
            isLoading,
            isSuccess,
            isError,
            error
        }
    ] = useUploadVideoSourceMutation()

    // toast messages
    useEffect(() => {
        if (isError) {
            let msg = 'Error uploading Video Source: ' + getToastMessage(error)
            toast.error(msg)
        }
        if (isSuccess) {
            toast('Video Source successfully uploaded')
        }
    }, [isError, isSuccess, error])

    // components
    const unitHintStyle = {marginLeft: '.5rem', color: $infoMsgColor, fontSize: 'small'}
    return (
        <Modal show={isShown}>
            <Header onHide={onCancelEdit}>
                Add / Edit Video source
            </Header>
            <Body>
                <div className="Video-source-edit-form">
                    <div className="Video-source-edit-section">
                        <h3>Channel</h3>
                        <input type="text"
                               autoComplete={'video-source-channel'}
                               className={videoSource.channel.valid ? '' : 'invalid'}
                               value={videoSource.channel.value}
                               placeholder="Enter a channel name"
                               onChange={(e) => onUpdateField('channel', e)}
                               id="channel"/>
                    </div>
                    <div className="Video-source-edit-section">
                        <h3>Video parts</h3>
                        <div className="Video-source-parts-list" id="video-parts">
                            {
                                videoSource['videoFiles'].map(videoFile =>
                                    <VideoFileEditor videoFile={videoFile} key={videoFile.videoFileId.value}/>
                                )
                            }
                        </div>
                    </div>
                    <div className="Video-source-edit-section">
                        <h3>Metadata</h3>
                        <ul className="Video-source-metadata-container">
                            <li>
                                <label>Resolution</label>
                                <Select
                                    style={{
                                        width: '12.75rem',
                                        borderColor: (videoSource.resolution.valid ? '' : 'red')
                                    }}
                                    onChange={onSelectResolution}
                                    selectedValue={videoSource.resolution.value}
                                    placeholder="SELECT RESOLUTION">
                                    {
                                        Object.keys(Resolution).map(res =>
                                            <Option value={res} key={'Video-source-resolution-' + res}>{res}</Option>)
                                    }
                                </Select>
                            </li>
                            <li>
                                <label htmlFor="source">Source</label>
                                <input type="text"
                                       autoComplete={'video-source-source'}
                                       className={videoSource.source.valid ? '' : 'invalid'}
                                       value={videoSource.source.value}
                                       placeholder={'ex: DVB-S2 ...'}
                                       onChange={(e) => onUpdateField('source', e)}
                                       id="source"/>
                            </li>
                            <li>
                                <label htmlFor="duration">Duration</label>
                                <input type="text"
                                       autoComplete={'video-source-duration'}
                                       required={true}
                                       className={videoSource.approximateDuration.valid ? '' : 'invalid'}
                                       value={videoSource.approximateDuration.value}
                                       placeholder={'ex: 90min ...'}
                                       onChange={(e) => onUpdateField('approximateDuration', e)}
                                       id="duration"/>
                            </li>
                            <li>
                                <label htmlFor="languages">Languages</label>
                                <input type="text"
                                       autoComplete={'video-source-languages'}
                                       className={videoSource.languages.valid ? '' : 'invalid'}
                                       value={videoSource.languages.value}
                                       placeholder={'ex: English, ...'}
                                       onChange={(e) => onUpdateField('languages', e)}
                                       id="languages"/>
                            </li>
                            <li>
                                <label htmlFor={'filesize'}>Filesize</label>
                                <input type={'number'}
                                       className={videoSource.filesize.valid ? '' : 'invalid'}
                                       min={1}
                                       max={100}
                                       size={4}
                                       value={videoSource.filesize.value}
                                       onChange={(e) => onUpdateField('filesize', e)}
                                       id={'filesize'}/>
                                <span style={unitHintStyle}>GB</span>
                            </li>
                            <li>
                                <label htmlFor={'media-container'}>Media container</label>
                                <input type="text"
                                       autoComplete="video-source-media-container"
                                       className={videoSource.mediaContainer.valid ? '' : 'invalid'}
                                       value={videoSource.mediaContainer.value}
                                       placeholder={'ex: MKV'}
                                       onChange={(e) => onUpdateField('mediaContainer', e)}
                                       id={'media-container'}/>
                            </li>
                            <li>
                                <label htmlFor="frameRate">Frame rate</label>
                                <input type="number"
                                       className={videoSource.frameRate.valid ? '' : 'invalid'}
                                       min={1}
                                       max={240}
                                       size={4}
                                       value={videoSource.frameRate.value}
                                       onChange={(e) => onUpdateField('frameRate', e)}
                                       id="frameRate"/>
                                <span style={unitHintStyle}>fps</span>
                            </li>
                            <li>
                                <label htmlFor="bitrate">Video bitrate</label>
                                <input type="number"
                                       className={videoSource.videoBitrate.valid ? '' : 'invalid'}
                                       min={1}
                                       max={20}
                                       value={videoSource.videoBitrate.value}
                                       onChange={(e) => onUpdateField('videoBitrate', e)}
                                       size={4}
                                       id="video-bitrate"/>
                                <span style={unitHintStyle}>Mbps</span>
                            </li>
                            <li>
                                <label htmlFor="video-codec">Video codec</label>
                                <input type="text"
                                       autoComplete={'video-source-video-codec'}
                                       className={videoSource.videoCodec.valid ? '' : 'invalid'}
                                       value={videoSource.videoCodec.value}
                                       placeholder={'ex: H.264 ...'}
                                       onChange={(e) => onUpdateField('videoCodec', e)}
                                       id="video-codec"/>
                            </li>
                            <li>
                                <label htmlFor={'audio-bitrate'}>Audio bitrate</label>
                                <input type={"number"}
                                       min={1}
                                       max={1000}
                                       size={5}
                                       className={videoSource.audioBitrate.valid ? '' : 'invalid'}
                                       value={videoSource.audioBitrate.value}
                                       onChange={(e) => onUpdateField('audioBitrate', e)}
                                       id={'audio-bitrate'}/>
                                <span style={unitHintStyle}>Kbps</span>
                            </li>
                            <li>
                                <label htmlFor="audio-codec">Audio codec</label>
                                <input type="text"
                                       autoComplete={'video-source-audio-codec'}
                                       className={videoSource.audioCodec.valid ? '' : 'invalid'}
                                       value={videoSource.audioCodec.value}
                                       placeholder={'ex: AC3 ...'}
                                       onChange={(e) => onUpdateField('audioCodec', e)}
                                       id="audio-codec"/>
                            </li>
                            <li>
                                <label>Audio channels</label>
                                <Select
                                    style={{
                                        width: '12.75rem',
                                        borderColor: (videoSource.audioChannels.valid ? '' : 'red')
                                    }}
                                    onChange={onSelectAudioChannels}
                                    selectedValue={videoSource.audioChannels.value}
                                    placeholder="SELECT AUDIO CH.">
                                    <Option value={'2'}>Stereo</Option>
                                    <Option value={'5.1'}>5.1</Option>
                                    <Option value={'7.1'}>7.1</Option>
                                </Select>
                            </li>
                        </ul>
                    </div>
                </div>
            </Body>
            <Footer>
                <CancelButton onClick={onCancelEdit}/>
                {
                    isLoading ?
                        <SmallSpinner/> :
                        isValid ?
                            <SaveButton onClick={onSaveVideoSource}/> :
                            <InfoMessage/>
                }
            </Footer>
        </Modal>
    )
}