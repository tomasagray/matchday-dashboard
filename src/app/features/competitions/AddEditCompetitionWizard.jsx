import React, {useEffect, useState} from "react";
import {GeneralEditor} from "../edit-wizard/GeneralEditor";
import {ArtworkEditor} from "../edit-wizard/ArtworkEditor";
import {
    useAddCompetitionEmblemMutation,
    useAddCompetitionFanartMutation,
    useAddNewCompetitionMutation,
    useDeleteCompetitionEmblemMutation,
    useDeleteCompetitionFanartMutation,
    useDeleteCompetitionMutation,
    useUpdateCompetitionMutation
} from "../../slices/api/competitionApiSlice";
import {DeleteWizard} from "../edit-wizard/DeleteWizard";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {EditWizard, EditWizardDisplay, EditWizardMenu} from "../edit-wizard/EditWizard";
import {WizardMenuItem} from "../edit-wizard/WizardMenuItem";
import {CancelButton} from "../../components/controls/CancelButton";
import {SaveButton} from "../../components/controls/SaveButton";
import {WarningMessage} from "../../components/WarningMessage";
import {DeleteButton} from "../../components/controls/DeleteButton";
import {useDispatch, useSelector} from "react-redux";
import {
    addCompetitionSynonym,
    deleteCompetitionSynonym,
    editCompetitionTitle,
    editNewSynonym,
    finishEditingCompetition,
    selectArtwork,
    selectEditedCompetition,
    selectEditedCompetitionForUpload,
    selectIsEditedCompetitionValid,
    setCompetitionCountry,
    uploadArtwork
} from "../../slices/competitionSlice";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";


export const AddEditCompetitionWizard = (props) => {

    const placeholderUrl = process.env.PUBLIC_URL + '/img/default_competition_poster.png'

    // wizard types
    const GENERAL = 'general'
    const EMBLEM = 'emblem'
    const FANART = 'fanart'
    const DELETE = 'delete'

    // handlers
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onHide = () => {
        onHideWizard && onHideWizard()
    }
    const onSelectWizard = (wizard) => () => {
        setSelectedWizard(wizard)
    }
    const onEditTitle = (title) => {
        dispatch(editCompetitionTitle({title}))
    }
    const onEditSynonym = (newSynonym) => {
        dispatch(editNewSynonym({newSynonym}))
    }
    const onAddSynonym = (synonym) => {
        dispatch(addCompetitionSynonym({
            synonym: {
                name: synonym,
            }
        }))
    }
    const onDeleteSynonym = (synonym) => {
        dispatch(deleteCompetitionSynonym({synonym}))
    }
    const onSelectCountry = (country) => {
        dispatch(setCompetitionCountry({country}))
    }
    const onUploadArtwork = (artwork) => {
        dispatch(uploadArtwork({artwork}))
    }
    const onSelectEmblem = (selection) => {
        dispatch(selectArtwork({selection, role: 'emblem'}))
    }
    const onSelectFanart = (selection) => {
        dispatch(selectArtwork({selection, role: 'fanart'}))
    }
    const onSaveEdits = async () => {
        if (isAddNew) {
            await addNewCompetition(uploadCompetition)
        } else {
            await updateCompetition(uploadCompetition)
        }
        onHide && onHide()
        dispatch(finishEditingCompetition())
    }
    const onDeleteCompetition = () => {
        onHideWizard(false)
        onShowHideDeleteConfirm()
    }
    const onShowHideDeleteConfirm = () => {
        setIsDeleteConfirmShown(!isDeleteConfirmShown)
    }
    const onCancelDeleteCompetition = () => {
        onShowHideDeleteConfirm()
        onHideWizard(true)
    }
    const onConfirmDeleteCompetition = async () => {
        console.log('deleting competition...')
        await deleteCompetition(competitionId)
            .unwrap()
            .then(() => {
                onShowHideDeleteConfirm()
                navigate('/competitions')
            })
            .catch(err => {
                console.log('Error deleting Competition', err)
                onShowHideDeleteConfirm()
                onHideWizard(true)
            })
        console.log('done deleting')
    }

    // state
    let {competitionId, imageUrl, isShown, onHideWizard} = props
    let isAddNew = competitionId === undefined
    let editedCompetition = useSelector(state => selectEditedCompetition(state))
    let editedCompetitionName = editedCompetition?.name?.name
    let uploadCompetition = useSelector(state => selectEditedCompetitionForUpload(state))
    let {isValid, reason} = useSelector(state => selectIsEditedCompetitionValid(state))
    let [selectedWizard, setSelectedWizard] = useState(GENERAL)
    let [isDeleteConfirmShown, setIsDeleteConfirmShown] = useState(false)

    // hooks
    const [
        addNewCompetition, {
            isLoading: isAddingNew,
            isSuccess: isAddSuccess,
            isError: isAddError,
            error: addError
        }
    ] = useAddNewCompetitionMutation()
    const [
        updateCompetition, {
            isLoading: isUpdatingCompetition,
            isSuccess: isUpdateCompetitionSuccess,
            isError: isUpdateCompetitionError,
            error: updateCompetitionError,
        }
    ] = useUpdateCompetitionMutation()
    const [
        deleteCompetition, {
            isLoading: isCompetitionDeleting,
            isSuccess: isDeleteCompetitionSuccess,
            isError: isDeleteCompetitionError,
            error: deleteCompetitionError,
        }
    ] = useDeleteCompetitionMutation()

    // toast messages
    useEffect(() => {
        if (isAddSuccess) {
            toast('Successfully added new Competition')
        }
        if (isAddError) {
            let msg = 'Error adding Competition: ' + getToastMessage(addError)
            toast.error(msg)
        }
        if (isUpdateCompetitionSuccess) {
            toast('Competition metadata successfully updated');
        }
        if (isUpdateCompetitionError) {
            let msg = 'Failed updating Competition: ' + getToastMessage(updateCompetitionError)
            toast.error(msg)
        }
        if (isDeleteCompetitionSuccess) {
            toast(`Successfully deleted Competition: ${competitionId}`)
        }
        if (isDeleteCompetitionError) {
            let msg = 'Error deleting Competition: ' + getToastMessage(deleteCompetitionError)
            toast.error(msg)
        }
    }, [
        competitionId, isAddSuccess, isAddError, addError,
        isUpdateCompetitionSuccess, isUpdateCompetitionError,
        updateCompetitionError, isDeleteCompetitionSuccess,
        isDeleteCompetitionError, deleteCompetitionError
    ])

    // components
    const wizards = {
        general:
            <GeneralEditor
                title={editedCompetition.name?.name}
                synonyms={editedCompetition.name?.synonyms}
                newTagValue={editedCompetition.newSynonym?.name}
                country={editedCompetition.country}
                onEditTitle={onEditTitle}
                onEditSynonym={onEditSynonym}
                onAddSynonym={onAddSynonym}
                onDeleteSynonym={onDeleteSynonym}
                onSelectCountry={onSelectCountry}
            />,
        emblem:
            <ArtworkEditor
                key="emblem"
                entityId={competitionId}
                hooks={{
                    uploadHook: useAddCompetitionEmblemMutation,
                    deleteHook: useDeleteCompetitionEmblemMutation,
                }}
                artwork={editedCompetition.emblem}
                onUpload={onUploadArtwork}
                onSelectArtwork={onSelectEmblem}
            />,
        fanart:
            <ArtworkEditor
                key="fanart"
                entityId={competitionId}
                hooks={{
                    uploadHook: useAddCompetitionFanartMutation,
                    deleteHook: useDeleteCompetitionFanartMutation,
                }}
                artwork={editedCompetition.fanart}
                onUpload={onUploadArtwork}
                onSelectArtwork={onSelectFanart}
            />,
        delete:
            <DeleteWizard
                entityName={editedCompetitionName}
                placeholderUrl={placeholderUrl}
                imageUrl={imageUrl}
                onDelete={onDeleteCompetition}
                isDeleting={isCompetitionDeleting}
            />,
    }

    let isInFlight = isUpdatingCompetition || isAddingNew || isCompetitionDeleting
    return (
        <>
            <Modal show={isShown}>
                <Header onHide={onHide}>
                    {
                        isAddNew ?
                            'Add new Competition ' :
                            'Edit Competition '
                    }
                    {
                        editedCompetitionName !== undefined && editedCompetitionName !== '' ?
                            <>
                                <span style={{color: '#666'}}>&mdash;&nbsp;</span>
                                <span style={{color: '#ccc'}}>{editedCompetitionName}</span>
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
                                Poster
                            </WizardMenuItem>
                            <WizardMenuItem
                                imgSrc="/img/icon/image/image_16.png"
                                onClick={onSelectWizard(FANART)}
                                selected={selectedWizard === FANART}>
                                Fanart
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
            <Modal show={isDeleteConfirmShown}>
                <Header onHide={onShowHideDeleteConfirm}>
                    Confirm &mdash; DELETE&nbsp;
                    <span style={{color: '#aaa'}}>
                        {editedCompetitionName}
                    </span>
                </Header>
                <Body>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <WarningMessage>
                            <span style={{color: '#888'}}>
                                Are you <strong>sure</strong> you want to delete the Competition: <br/>
                            </span>
                            <strong>{editedCompetitionName}</strong> <br/>
                            <strong style={{color: 'red'}}>This CANNOT be undone!</strong>
                        </WarningMessage>
                    </div>
                </Body>
                <Footer>
                    <DeleteButton onClick={onConfirmDeleteCompetition} isLoading={isCompetitionDeleting}/>
                    <CancelButton onClick={onCancelDeleteCompetition}/>
                </Footer>
            </Modal>
        </>
    )
}