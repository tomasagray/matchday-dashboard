import React, {useEffect, useState} from "react";
import {DownloadButton} from "../../components/controls/DownloadButton";
import {DeleteButton} from "../../components/controls/DeleteButton";
import {useCaptureKeyPress} from "../../hooks/useCaptureKeyPress";
import {useRestoreSystemMutation} from "../../slices/api/adminApiSlice";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";

export const RestorePointTable = (props) => {

    // handlers
    const onClickRow = (rp) => {
        setSelectedRp(rp)
    }
    const onRestoreFromBackup = async () => {
        console.log('restoring system...', selectedRp)
        await restoreSystem(selectedRp.id)
        console.log('done restoring system.', restoredSystemPoint)
    }
    const onDownloadBackup = (backup) => {
        console.log('download backup', backup)
    }
    const onDeleteBackup = (backup) => {
        console.log('delete this one', backup)
    }
    const onDeselectRestorePoint = () => {
        setSelectedRp(null)
    }

    // state
    let {restorePoints} = props
    let [selectedRp, setSelectedRp] = useState(null)

    // hooks
    useCaptureKeyPress({action: onDeselectRestorePoint, key: 'z'})
    let [
        restoreSystem, {
            data: restoredSystemPoint,
            isLoading: isRestoring,
            isSuccess: isRestoreSuccess,
            isError: isRestoreError,
            error: restoreError,
        }
    ] = useRestoreSystemMutation()

    // toast messages
    useEffect(() => {
        if (isRestoreError) {
            let msg = 'Error restoring system: ' + getToastMessage(restoreError)
            toast.error(msg)
        }
        if (isRestoreSuccess) {
            toast('System successfully restored')
        }
    }, [isRestoreError, restoreError, isRestoreSuccess])

    return (
        <>
            {
                restorePoints.length > 0 ?
                    <>
                        <div className="Database-table-container">
                            <table className="Database-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Timestamp</th>
                                    <th>Filesize</th>
                                    <th>Events</th>
                                    <th>Competitions</th>
                                    <th>Teams</th>
                                    <th>Data sources</th>
                                    <th>File server users</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    restorePoints.map(restorePoint =>
                                        <tr
                                            className={selectedRp === restorePoint ? 'selected' : ''}
                                            key={restorePoint.id}
                                            onClick={() => onClickRow(restorePoint)}>
                                            {
                                                Object.values(restorePoint).map(value =>
                                                    <td key={restorePoint.id + value}> {value} </td>
                                                )
                                            }
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                        <div
                            className="Restore-button-container"
                            style={{display: (selectedRp === null ? 'none' : '')}}>
                            <button
                                disabled={isRestoring}
                                className="Small-button"
                                style={{marginRight: '.5rem'}}
                                onClick={onRestoreFromBackup}>
                                Restore from selected
                            </button>
                            <DownloadButton disabled={isRestoring} onClick={onDownloadBackup}/>
                            <DeleteButton disabled={isRestoring} onClick={onDeleteBackup}/>
                        </div>
                    </> :
                    <p style={{color: '#888'}}>
                        There are currently <strong>no</strong> restore points.
                    </p>
            }
        </>
    )
}