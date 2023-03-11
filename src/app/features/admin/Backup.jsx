import React, {useEffect} from "react";
import {useCreateRestorePointMutation, useGetAllRestorePointsQuery} from "../../slices/api/adminApiSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {RestorePointTable} from "./RestorePointTable";

export const Backup = () => {

    // handlers
    const onCreateRestorePoint = async () => {
        console.log('creating system restore point...')
        await createRestorePoint()
        console.log('done creating system restore point')
    }

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

    // toast messages
    useEffect(() => {
        if (isCreateError) {
            let msg = 'Error creating System Restore Point: ' + getToastMessage(createError)
            toast.error(msg)
        }
        if (isCreatedSuccess) {
            toast('Created System Restore Point')
        }
    }, [isCreateError, createError, isCreatedSuccess])

    return (
        <>
            <h1 style={{marginBottom: '2rem'}}>Backup</h1>
            <div style={{marginBottom: '2rem'}}>
                <button
                    disabled={isCreating}
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
        </>
    )
}