import React, {useEffect, useState} from "react";
import {FileUploadButton} from "../../components/controls/FileUploadButton";
import {toast} from "react-toastify";
import {SmallSpinner} from "../../components/Spinner";
import {getToastMessage} from "../../app/utils";
import {ClearButton} from "../../components/controls/ClearButton";
import {ArtworkDisplay} from "./ArtworkDisplay";


export const ArtworkEditor = (props) => {


    // handlers
    const onEnterUrlMode = () => {
        setIsEnterUrlMode(true)
    }
    const onCancelEnterUrlMode = () => {
        setIsEnterUrlMode(false)
        setUploadUrl('')
    }
    const onChangeUploadUrl = (e) => {
        setUploadUrl(e.target.value)
    }
    const onUploadImage = async (e) => {
        let img = e.target.files[0]
        if (!img.type.startsWith('image')) {
            toast.error('You must select an image file')
            return
        }
        let formData = new FormData()
        formData.append('id', entityId)
        formData.append('image', img)
        let result = await uploadArtwork({
            entityId,
            formData
        })
        if (result.data) {
            onUpload && onUpload(result.data)
        }
        // todo - clear file upload input
    }
    const onUploadUrl = (e) => {
        console.log('upload URL', e)
        // TODO: implement this
    }
    const onClickImage = (artwork) => {
        onSelectArtwork && onSelectArtwork({selectedId: artwork.id})
    }

    // state
    let {entityId, artwork, hooks, onUpload, onSelectArtwork} = props
    let {upload} = hooks
    let [isEnterUrlMode, setIsEnterUrlMode] = useState(false)
    let [uploadUrl, setUploadUrl] = useState('')
    console.log('artwork', JSON.stringify(artwork))

    // hooks
    const [uploadArtwork, {
            /*isSuccess: isUploadSuccess,*/
            isLoading: isUploading,
            isError: isUploadError,
            error: uploadError
    }] = upload()
    
    // toast messages
    useEffect(() => {
        if (isUploadError) {
            let msg = 'Error uploading artwork: ' + getToastMessage(uploadError)
            toast.error(msg)
        }
    }, [isUploadError, uploadError])

    // components
    let enterUrl = <>
        <div className="Artwork-upload-form">
            <input type="url" placeholder="https://..." value={uploadUrl} onChange={onChangeUploadUrl} />
            <button className="Small-button" onClick={onUploadUrl} disabled={isUploading}>
                {
                    isUploading ? <SmallSpinner /> :
                        <p>
                        Upload &nbsp;
                        <img src={process.env.PUBLIC_URL + '/img/icon/upload/upload_16.png'} alt="Upload" />
                    </p>
                }
            </button>
        </div>
        <ClearButton onClick={onCancelEnterUrlMode} />
    </>

    return (
        <div className="Artwork-editor">
            <div className="Artwork-upload-container">
                {
                    isEnterUrlMode ?
                        enterUrl :
                        <>
                            <button className="Link-button" onClick={onEnterUrlMode}>
                                Enter URL
                            </button>
                            <FileUploadButton onChange={onUploadImage} accept="image/*" />
                        </>
                }
            </div>
            <div className="Artwork-collection-container">
                <div className="Artwork-collection-display">
                    {
                        artwork.collection != null ?
                            artwork.collection.map(artwork =>
                                <ArtworkDisplay
                                    className={artwork.selected ? 'selected' : ''}
                                    artwork={artwork}
                                    key={artwork.id}
                                    onClick={onClickImage}
                                />
                            ) :
                            <p style={{position: 'absolute', color: 'rgba(200,200,200,.8)'}}>
                                There is currently no artwork.
                            </p>
                    }
                </div>
            </div>
        </div>
    )
}
