import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {
    useFetchCompetitionByIdQuery,
    useFetchTeamsForCompetitionQuery,
    useUpdateCompetitionMutation
} from "./competitionApiSlice";
import {CenteredSpinner, FillSpinner} from "../../components/Spinner";
import ContentBar from "../../components/ContentBar";
import {useFetchEventsForCompetitionQuery} from "../events/eventApiSlice";
import EventTile from "../events/EventTile";
import TeamTile from "../teams/TeamTile";
import {EditButton} from "../../components/controls/EditButton";
import {toast} from "react-toastify";
import {getToastMessage} from "../../app/utils";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {EditWizard, EditWizardDisplay, EditWizardMenu} from "../edit-wizard/EditWizard";
import {CancelButton} from "../../components/controls/CancelButton";
import {SaveButton} from "../../components/controls/SaveButton";
import {WizardMenuItem} from "../edit-wizard/WizardMenuItem";
import {GeneralEditor} from "../edit-wizard/GeneralEditor";
import {
    addCompetitionSynonym,
    beginEditingCompetition,
    deleteCompetitionSynonym,
    editCompetitionTitle,
    editNewSynonym,
    selectEditedCompetition,
    selectEditedCompetitionForUpload,
    setCompetitionCountry
} from "./competitionSlice";
import {useDispatch, useSelector} from "react-redux";
import {ArtworkEditor} from "../edit-wizard/ArtworkEditor";

export const CompetitionDetails = () => {

    // wizard types
    const GENERAL = 'general'
    const EMBLEM = 'emblem'
    const FANART = 'fanart'

    // handlers
    const onClickEditButton = (e) => {
        e.preventDefault()
        dispatch(beginEditingCompetition({competition}))
        setIsEditModalShown(true)
    }
    const onCloseEditModal = () => {
        setIsEditModalShown(false)
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
                // properName: editedCompetition.name,
            }
        }))
    }
    const onDeleteSynonym = (synonym) => {
        dispatch(deleteCompetitionSynonym({synonym}))
    }
    const onSelectCountry = (country) => {
        dispatch(setCompetitionCountry({country}))
    }
    const onSaveEdits = async () => {
        console.log('save edits here')
        console.log('upload:', uploadCompetition)
        updateCompetition(uploadCompetition).unwrap().then(() => onCloseEditModal())
    }

    //state
    const params = useParams()
    const {competitionId} = params
    const dispatch = useDispatch()
    let [isEditModalShown, setIsEditModalShown] = useState(false)
    let [selectedWizard, setSelectedWizard] = useState(GENERAL)
    let editedCompetition = useSelector(state => selectEditedCompetition(state))
    let uploadCompetition = useSelector(state => selectEditedCompetitionForUpload(state))

    // hooks
    const {
        data: competition,
        isLoading: isCompetitionLoading,
        isSuccess: isCompetitionSuccess,
        isError: isCompetitionError,
        error: competitionError
    } = useFetchCompetitionByIdQuery(competitionId)
    let name = competition?.name
    const {
        data: teams,
        isLoading: isTeamsLoading,
        isSuccess: isTeamsSuccess,
        isError: isTeamsError,
        error: teamsError
    } = useFetchTeamsForCompetitionQuery(competitionId)
    const {
        data: events,
        isLoading: isEventsLoading,
        isError: isEventsError,
        error: eventsError
    } = useFetchEventsForCompetitionQuery(competitionId)
    const [
        updateCompetition, {
            isLoading: isUpdatingCompetition,
            isSuccess: isUpdateCompetitionSuccess,
            isError: isUpdateCompetitionError,
            error: updateCompetitionError,
        }
    ] = useUpdateCompetitionMutation(uploadCompetition)

    // toast messages
    useEffect(() => {
        if (isCompetitionError) {
            let msg = `Failed to load Competition data for: ${competitionId}` + getToastMessage(competitionError)
            toast.error(msg)
        }
        if (isTeamsError) {
            let msg = 'Failed to load Teams: ' + getToastMessage(teamsError)
            toast.error(msg)
        }
        if (isEventsError) {
            let msg = 'Failed to load Events data: ' + getToastMessage(eventsError)
            toast.error(msg)
        }
        if (isUpdateCompetitionSuccess) {
            toast('Competition metadata successfully updated')
        }
        if (isUpdateCompetitionError) {
            let msg = 'Failed updating Competition: ' + getToastMessage(updateCompetitionError);
            toast.error(msg);
        }
    }, [
        competitionId,
        isCompetitionError,
        competitionError,
        isEventsError,
        eventsError,
        isTeamsError,
        teamsError,
        isUpdateCompetitionSuccess,
        isUpdateCompetitionError,
        updateCompetitionError
    ])

    // components
    let eventTiles = events?.map(event => <EventTile event={event} /> ) ?? []
    let teamTiles =
        isTeamsSuccess && teams ?
            Object.values(teams.entities).map(
                team => <TeamTile team={team} key={team.id} />
            ) : []
    let wizards = {
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
        emblem: <ArtworkEditor />,
        fanart: <ArtworkEditor />,
    }

    return (
        <>
            {
                isCompetitionLoading ?
                    <FillSpinner/> :
                    isCompetitionSuccess ?
                        <div>
                            <Modal show={isEditModalShown}>
                                <Header onHide={onCloseEditModal}>
                                    Edit competition &mdash;&nbsp;
                                    <span style={{color: '#ccc'}}>
                                        {name?.name}
                                    </span>
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
                                        </EditWizardMenu>
                                        <EditWizardDisplay>
                                            {wizards[selectedWizard]}
                                        </EditWizardDisplay>
                                    </EditWizard>
                                </Body>
                                <Footer>
                                    <CancelButton onClick={onCloseEditModal} />
                                    <SaveButton onClick={onSaveEdits} isLoading={isUpdatingCompetition} />
                                </Footer>
                            </Modal>

                            <h1 className="Detail-title">{name?.name}</h1>
                            <div className="Detail-header">
                                <img src={competition['_links']['emblem'].href} alt={name?.name}
                                     className="Detail-poster"/>
                                <div className="Detail-data">
                                    <EditButton onClick={onClickEditButton} />
                                </div>
                            </div>
                            {
                                isEventsLoading ?
                                    <CenteredSpinner /> :
                                    <ContentBar title="Most recent events" items={eventTiles}/>
                            }
                            <div className="Competition-teams-container">
                                <h2 className="Content-bar-title">Teams</h2>
                                {
                                    isTeamsLoading ?
                                        <CenteredSpinner /> :
                                        <div className="Entity-display">
                                            {teamTiles}
                                        </div>
                                }
                            </div>
                        </div> :
                        null
            }
        </>
    )
}
