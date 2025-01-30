import React, {useEffect, useState} from "react";
import {
    useCreateRestorePointMutation,
    useGetAllRestorePointsQuery,
    useLazyDehydrateSystemQuery,
    useRehydrateSystemMutation
} from "../../slices/api/adminApiSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";
import {downloadData, getDownloadableJson, getToastMessage, setBackgroundImage} from "../../utils";
import {toast} from "react-toastify";
import {RestorePointTable} from "./RestorePointTable";
import {FileUploadButton} from "../../components/controls/FileUploadButton";
import dayjs from "dayjs";

export const Backup = () => {

    // handlers
    const onCreateRestorePoint = async () => {
        console.log('creating system restore point...')
        await createRestorePoint()
        console.log('done creating system restore point')
    }
    const onDehydrate = async () => {
        console.log('dehydrating system...')
        dehydrate().unwrap().then(response => {
            let json = getDownloadableJson(response)
            let timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss')
            let filename = `matchday_system-image_${timestamp}.json`
            downloadData(json, filename)
            toast('Downloaded dehydrated System Image to: ' + filename)
        })
        console.log('done dehydrating')
    }
    const onUploadSystemImage = (e) => {
        let file = e.target.files[0]
        setSystemImage(file)
    }
    const onClearSystemImage = () => {
        setSystemImage(null)
    }
    const onRehydrate = () => {
        console.log('rehydrating system...', systemImage)
        rehydrate(systemImage)
    }

    // state
    let [systemImage, setSystemImage] = useState(null)

    // hooks
    let {
        data: restorePoints,
        isLoading,
        isSuccess,
        /*isError,*/
        error
    } = useGetAllRestorePointsQuery()
    let [
        createRestorePoint, {
            /*data: createdRestorePoint,*/
            isLoading: isCreating,
            isSuccess: isCreatedSuccess,
            isError: isCreateError,
            error: createError,
        }
    ] = useCreateRestorePointMutation()
    let [
        dehydrate, {
            isLoading: isDehydrating,
            isError: isDehydrationError,
            error: dehydrationError,
        }
    ] = useLazyDehydrateSystemQuery()
    let [
        rehydrate, {
            isLoading: isRehydrating,
            isError: isRehydrationError,
            error: rehydrationError,
        }
    ] = useRehydrateSystemMutation()

    // toast messages
    useEffect(() => {
        if (isCreateError) {
            let msg = 'Error creating System Restore Point: ' + getToastMessage(createError)
            toast.error(msg)
        }
        if (isCreatedSuccess) {
            toast('Created System Restore Point')
        }
        if (isDehydrationError) {
            let msg = 'Error dehydrating system: ' + getToastMessage(dehydrationError)
            toast.error(msg)
        }
        if (isRehydrationError) {
            let msg = 'Error rehydrating system: ' + getToastMessage(rehydrationError)
            toast.error(msg)
        }
    }, [
        isCreateError, createError, isCreatedSuccess,
        isDehydrationError, dehydrationError,
        isRehydrationError, rehydrationError,
    ])

    let isInFlight = isCreating || isDehydrating || isRehydrating

    setBackgroundImage('none')
    return (
        <>
            <h1 style={{marginBottom: '2rem'}}>Backup</h1>
            <div style={{marginBottom: '2rem'}}>
                <button
                    disabled={isInFlight}
                    className="Small-button" style={{margin: '0'}}
                    onClick={onCreateRestorePoint}>
                    Create restore point
                </button>
            </div>
            <h3 style={{marginBottom: '1rem', display: 'inline'}}>
                Restore points &nbsp;
                <span style={{color: '#888', fontWeight: 'normal', fontSize: 'x-small', display: 'inline'}}>
                    Press <strong>Ctrl+Z</strong> to deselect
                </span>
            </h3>
            <div style={{marginBottom: '2rem'}}>
                {
                    isLoading ?
                        <CenteredSpinner/> :
                        isSuccess ?
                            <RestorePointTable restorePoints={restorePoints}/> :
                            <ErrorMessage code={error.message}>Could not fetch restore points!</ErrorMessage>
                }
            </div>
            <div style={{marginBottom: '2rem'}}>
                <h3 style={{marginBottom: '1rem'}}>Hydration</h3>
                <p style={{color: '#888', marginBottom: '1rem'}}>
                    Export main entities to JSON or rehydrate a fresh system with previously dehydrated data.
                </p>
                <button
                    disabled={isInFlight}
                    className="Small-button"
                    style={{marginBottom: '1rem', marginLeft: 0}}
                    onClick={onDehydrate}>
                    Dehydrate
                </button>
                <div>
                    <p style={{color: '#888', marginBottom: '1rem'}}>
                        Rehydrate system from JSON
                    </p>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <FileUploadButton
                            disabled={isInFlight}
                            value={systemImage?.name}
                            onChange={onUploadSystemImage}
                            onClear={onClearSystemImage}
                            style={{marginRight: '2rem'}}
                        />
                        <button
                            disabled={isInFlight}
                            className="Small-button"
                            style={{display: (systemImage === null ? 'none' : '')}}
                            onClick={onRehydrate}>
                            Rehydrate
                        </button>
                    </div>
                </div>
            </div>
            <br/>
        </>
    )
}