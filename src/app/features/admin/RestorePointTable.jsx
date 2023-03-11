import React, {useEffect, useState} from "react";
import {DownloadButton} from "../../components/controls/DownloadButton";
import {DeleteButton} from "../../components/controls/DeleteButton";
import {useCaptureKeyPress} from "../../hooks/useCaptureKeyPress";
import {useDeleteRestorePointMutation, useRestoreSystemMutation} from "../../slices/api/adminApiSlice";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import properties from "../../properties";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {WarningMessage} from "../../components/WarningMessage";
import {CancelButton} from "../../components/controls/CancelButton";

export const RestorePointTable = (props) => {

    const {baseUrl} = properties
    // handlers
    const onClickRow = (rp) => {
        setSelectedRp(rp)
    }
    const onRestoreFromBackup = async () => {
        console.log('restoring system...', selectedRp)
        await restoreSystem(selectedRp.id)
        console.log('done restoring system.', restoredSystemPoint)
    }
    const onDownloadBackup = () => {
        const a = document.createElement('a')
        const url = `${baseUrl}/system/restore-points/${selectedRp.id}/download`
        const filename = `matchday_restore_${selectedRp.id}.zip`
        a.setAttribute('href', url)
        a.setAttribute('download', filename)
        a.click()
        toast('Downloaded System Restore Point to: ' + filename)
    }
    const onDeleteBackup = async () => {
        console.log('deleting restore point...', selectedRp.id)
        deleteRestorePoint(selectedRp.id)
            .unwrap()
            .then(response => console.log('deleted restore point: ', response))
        onToggleDeleteModalShown()
    }
    const onDeselectRestorePoint = () => {
        setSelectedRp(null)
    }
    const onToggleDeleteModalShown = () => {
        setIsDeleteModalShown(!isDeleteModalShown)
    }

    // state
    let {restorePoints} = props
    let [selectedRp, setSelectedRp] = useState(null)
    let [isDeleteModalShown, setIsDeleteModalShown] = useState(false)

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
    let [
        deleteRestorePoint, {
            // data: deletedRestorePoint,
            isLoading: isDeleting,
            isSuccess: isDeleted,
            isError: isDeleteError,
            error: deleteError,
        }
    ] = useDeleteRestorePointMutation()

    // toast messages
    useEffect(() => {
        if (isRestoreError) {
            let msg = 'Error restoring system: ' + getToastMessage(restoreError)
            toast.error(msg)
        }
        if (isRestoreSuccess) {
            toast('System successfully restored')
        }
        if (isDeleteError) {
            let msg = 'Error deleting System Restore Point: ' + getToastMessage(deleteError)
            toast.error(msg)
        }
        if (isDeleted) {
            toast('Successfully deleted System Restore Point')
        }
    }, [isRestoreError, restoreError, isRestoreSuccess, isDeleteError, deleteError, isDeleted])

    let isInFlight = isRestoring || isDeleting
    return (
        <>
            {
                restorePoints.length > 0 ?
                    <>
                        <Modal show={isDeleteModalShown}>
                            <Header onhide={onToggleDeleteModalShown}>
                                Confirm: DELETE Restore Point
                            </Header>
                            <Body>
                                <WarningMessage>
                                    Are you sure you want to delete this System Restore Point? <br/>
                                    <strong>This cannot be undone!</strong>
                                </WarningMessage>
                            </Body>
                            <Footer>
                                <CancelButton onClick={onToggleDeleteModalShown}/>
                                <DeleteButton onClick={onDeleteBackup} disabled={isInFlight}/>
                            </Footer>
                        </Modal>
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
                                disabled={isInFlight}
                                className="Small-button"
                                style={{marginRight: '.5rem'}}
                                onClick={onRestoreFromBackup}>
                                Restore from selected
                            </button>
                            <DownloadButton disabled={isInFlight} onClick={onDownloadBackup}/>
                            <DeleteButton disabled={isInFlight} onClick={onToggleDeleteModalShown}/>
                        </div>
                    </> :
                    <p style={{color: '#888'}}>
                        There are currently <strong>no</strong> restore points.
                    </p>
            }
        </>
    )
}