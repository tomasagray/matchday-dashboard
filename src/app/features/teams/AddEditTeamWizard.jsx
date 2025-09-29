import React, {useEffect, useState} from "react";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {EditWizard, EditWizardDisplay, EditWizardMenu} from "../edit-wizard/EditWizard";
import {WizardMenuItem} from "../edit-wizard/WizardMenuItem";
import {CancelButton} from "../../components/controls/CancelButton";
import {SaveButton} from "../../components/controls/SaveButton";
import {
    addTeamColor,
    addTeamSynonym,
    deleteTeamColor,
    deleteTeamSynonym,
    editNewSynonym,
    editTeamTitle,
    finishEditingTeam,
    selectEditedTeam,
    selectEditedTeamForUpload,
    selectIsEditedTeamValid,
    selectTeamArtwork,
    setTeamColor,
    setTeamCountry,
    uploadTeamArtwork
} from "../../slices/teamSlice";
import {useDispatch, useSelector} from "react-redux";
import {GeneralEditor} from "../edit-wizard/GeneralEditor";
import {ArtworkEditor} from "../edit-wizard/ArtworkEditor";
import {
    useAddNewTeamMutation,
    useAddTeamEmblemMutation,
    useAddTeamFanartMutation,
    useDeleteTeamEmblemMutation,
    useDeleteTeamFanartMutation,
    useDeleteTeamMutation,
    useUpdateTeamMutation
} from "../../slices/api/teamApiSlice";
import {ColorsEditor} from "../edit-wizard/ColorsEditor";
import {DeleteWizard} from "../edit-wizard/DeleteWizard";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import {WarningMessage} from "../../components/WarningMessage";
import {DeleteButton} from "../../components/controls/DeleteButton";
import {useNavigate} from "react-router-dom";


export const AddEditTeamWizard = (props) => {

    const posterPlaceholder = '/img/default_team_emblem.png'

    // wizard types
    const GENERAL = 'general'
    const EMBLEM = 'emblem'
    const FANART = 'fanart'
    const COLORS = 'colors'
    const DELETE = 'delete'

    // handlers
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onHide = () => {
        dispatch(finishEditingTeam())
        onHideWizard && onHideWizard()
    }
    const onSelectWizard = (wizard) => () => {
        setSelectedWizard(wizard)
    }
    const onEditTitle = (title) => {
        dispatch(editTeamTitle({title}))
    }
    const onEditSynonym = (synonym) => {
        dispatch(editNewSynonym({synonym}))
    }
    const onAddSynonym = (synonym) => {
        dispatch(addTeamSynonym({
            synonym: {
                name: synonym,
            }
        }))
    }
    const onDeleteSynonym = (synonym) => {
        dispatch(deleteTeamSynonym({synonym}))
    }
    const onSelectCountry = (country) => {
        dispatch(setTeamCountry({country}))
    }
    const onSaveEdits = async () => {
        if (isAddNew) {
            await addNewTeam(uploadTeam)
        } else {
            await updateTeam(uploadTeam);
        }
        onHideWizard && onHideWizard()
        dispatch(finishEditingTeam())
    }
    const onUploadArtwork = (artwork) => {
        dispatch(uploadTeamArtwork({artwork}))
    }
    const onSelectEmblem = (selection) => {
        dispatch(selectTeamArtwork({selection, role: 'emblem'}))
    }
    const onSelectFanart = (selection) => {
        dispatch(selectTeamArtwork({selection, role: 'fanart'}))
    }
    const onSelectTeamColor = (color, priority) => {
        dispatch(setTeamColor({color, priority}))
    }
    const onAddTeamColor = () => {
        dispatch(addTeamColor({}))
    }
    const onDeleteTeamColor = (priority) => {
        dispatch(deleteTeamColor({priority}))
    }
    const onShowHideDeleteConfirm = () => {
        setIsDeleteConfirmShown(!isDeleteConfirmShown)
    }
    const onDeleteTeam = async () => {
        onHideWizard(false)
        onShowHideDeleteConfirm()
    }
    const onCancelDeleteTeam = () => {
        onShowHideDeleteConfirm()
        onHideWizard(true)
    }
    const onConfirmDeleteTeam = () => {
        console.log('deleting team ...')
        deleteTeam(editedTeam.id)
            .unwrap()
            .then(() => {
                onShowHideDeleteConfirm()
                navigate('/teams')
            })
            .catch(err => console.error('error', err))
        console.log('done deleting')
    }

    // state
    let {teamId, imageUrl, isShown, onHideWizard} = props
    let isAddNew = teamId === undefined
    let [selectedWizard, setSelectedWizard] = useState(GENERAL)
    let [isDeleteConfirmShown, setIsDeleteConfirmShown] = useState(false)
    let editedTeam = useSelector(state => selectEditedTeam(state))
    let editedTeamName = editedTeam.name?.name
    let uploadTeam = useSelector(state => selectEditedTeamForUpload(state))
    let {isValid, reason} = useSelector(state => selectIsEditedTeamValid(state))

    // hooks
    const [
        addNewTeam, {
            isLoading: isAddingNew,
            isSuccess: isAddSuccess,
            isError: isAddError,
            error: addError
        }
    ] = useAddNewTeamMutation()
    const [
        updateTeam, {
            isLoading: isUpdatingTeam,
            isSuccess: isUpdateSuccess,
            isError: isUpdateError,
            error: updateError,
        }
    ] = useUpdateTeamMutation()
    const [
        deleteTeam, {
            data: deletedTeamId,
            isLoading: isTeamDeleting,
            isSuccess: isTeamDeleteSuccess,
            isError: isTeamDeleteError,
            error: teamDeleteError
        }
    ] = useDeleteTeamMutation()

    // toast messages
    useEffect(() => {
        if (isAddSuccess) {
            toast('Successfully added new Team')
        }
        if (isAddError) {
            let msg = 'Error adding new Team: ' + getToastMessage(addError)
            toast.error(msg)
        }
        if (isUpdateSuccess) {
            toast('Successfully updated Team');
        }
        if (isUpdateError) {
            let msg = 'Could not update Team: ' + getToastMessage(updateError)
            toast.error(msg)
        }
        if (isTeamDeleteSuccess) {
            toast(`Team: ${deletedTeamId} successfully deleted`)
        }
        if (isTeamDeleteError) {
            let msg = 'Error deleting Team: ' + getToastMessage(teamDeleteError)
            toast.error(msg)
        }
    }, [
        isAddSuccess, isAddError, addError,
        isUpdateSuccess, isUpdateError, updateError, isTeamDeleteSuccess,
        deletedTeamId, isTeamDeleteError, teamDeleteError
    ])

    // wizards
    let wizards = {
        general:
            <GeneralEditor
                title={editedTeamName}
                synonyms={editedTeam.name?.synonyms}
                newTagValue={editedTeam.newSynonym?.name}
                country={editedTeam.country}
                onEditTitle={onEditTitle}
                onEditSynonym={onEditSynonym}
                onAddSynonym={onAddSynonym}
                onDeleteSynonym={onDeleteSynonym}
                onSelectCountry={onSelectCountry}
            />,
        emblem:
            <ArtworkEditor
                key="emblem"
                entityId={teamId}
                hooks={{
                    uploadHook: useAddTeamEmblemMutation,
                    deleteHook: useDeleteTeamEmblemMutation,
                }}
                artwork={editedTeam.emblem}
                onUpload={onUploadArtwork}
                onSelectArtwork={onSelectEmblem}
            />,
        fanart:
            <ArtworkEditor
                key="fanart"
                entityId={teamId}
                hooks={{
                    uploadHook: useAddTeamFanartMutation,
                    deleteHook: useDeleteTeamFanartMutation,
                }}
                artwork={editedTeam.fanart}
                onUpload={onUploadArtwork}
                onSelectArtwork={onSelectFanart}
            />,
        colors:
            <ColorsEditor
                colors={editedTeam.colors}
                onSelectColor={onSelectTeamColor}
                onAddColor={onAddTeamColor}
                onDeleteColor={onDeleteTeamColor}
            />,
        delete:
            <DeleteWizard
                entityName={editedTeamName}
                placeholderUrl={posterPlaceholder}
                imageUrl={imageUrl}
                onDelete={onDeleteTeam}
                isDeleting={isTeamDeleting}
            />,
    }

    // components
    let isInFlight = isUpdatingTeam || isAddingNew || isTeamDeleting
    return (
        <>
            <Modal show={isDeleteConfirmShown}>
                <Header onHide={onCancelDeleteTeam}>
                    Confirm: Delete <span style={{color: '#aaa'}}>{editedTeamName}</span>
                </Header>
                <Body>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <WarningMessage>
                            <span style={{color: '#888'}}>
                                Are you <strong>sure</strong> you want to delete the team: <br/>
                            </span>
                            <strong>{editedTeamName}</strong> <br/>
                            <strong style={{color: 'red'}}>
                                This CANNOT be undone
                            </strong>
                        </WarningMessage>
                    </div>
                </Body>
                <Footer>
                    <CancelButton onClick={onCancelDeleteTeam}/>
                    <DeleteButton onClick={onConfirmDeleteTeam} isLoading={isTeamDeleting}/>
                </Footer>
            </Modal>
            <Modal show={isShown}>
                <Header onHide={onHide}>
                    {
                        isAddNew ?
                            'Add new Team ' :
                            'Edit Team '
                    }
                    {
                        editedTeamName !== undefined && editedTeamName !== '' ?
                            <>
                                <span style={{color: '#666'}}>&mdash;&nbsp;</span>
                                <span style={{color: '#ccc'}}>{editedTeamName}</span>
                            </> :
                            null
                    }
                </Header>
                <Body>
                    <EditWizard>
                        <EditWizardMenu>
                            <WizardMenuItem
                                imgSrc="/img/icon/form/form_16.png"
                                onClick={onSelectWizard(GENERAL)}
                                selected={selectedWizard === GENERAL}>
                                General
                            </WizardMenuItem>
                            <WizardMenuItem
                                imgSrc="/img/icon/image/image_16.png"
                                onClick={onSelectWizard(EMBLEM)}
                                selected={selectedWizard === EMBLEM}>
                                Emblem
                            </WizardMenuItem>
                            <WizardMenuItem
                                imgSrc="/img/icon/image/image_16.png"
                                onClick={onSelectWizard(FANART)}
                                selected={selectedWizard === FANART}>
                                Fanart
                            </WizardMenuItem>
                            <WizardMenuItem
                                imgSrc="/img/icon/colors/colors_16.png"
                                onClick={onSelectWizard(COLORS)}
                                selected={selectedWizard === COLORS}>
                                Colors
                            </WizardMenuItem>
                            {
                                !isAddNew ?
                                    <WizardMenuItem
                                        imgSrc="/img/icon/delete/delete_16.png"
                                        onClick={onSelectWizard(DELETE)}
                                        selected={selectedWizard === DELETE}>
                                        Delete
                                    </WizardMenuItem> :
                                    null
                            }
                        </EditWizardMenu>
                        <EditWizardDisplay>
                            {wizards[selectedWizard]}
                        </EditWizardDisplay>
                    </EditWizard>
                </Body>
                <Footer>
                    <div className={'Wizard-footer-container'}>
                        {
                            !isValid ?
                                <div className={'Wizard-reason-container'}>
                                    <img src={'/img/icon/info/info_32.png'} alt={'Info'}/>
                                    <span>{reason}</span>
                                </div> :
                                null
                        }
                        <div className={'Wizard-button-container'}>
                            <CancelButton onClick={onHide}/>
                            <SaveButton onClick={onSaveEdits} isLoading={isInFlight} disabled={!isValid}/>
                        </div>
                    </div>
                </Footer>
            </Modal>
        </>
    )
}