import ContentBar from "../../components/ContentBar";
import {useParams} from "react-router-dom";
import {
    useAddTeamEmblemMutation,
    useAddTeamFanartMutation,
    useDeleteTeamEmblemMutation,
    useDeleteTeamFanartMutation,
    useFetchCompetitionsForTeamQuery,
    useFetchTeamByIdQuery,
    useUpdateTeamMutation
} from "./teamApiSlice";
import {CenteredSpinner, FillSpinner} from "../../components/Spinner";
import {useFetchMatchesForTeamQuery} from "../events/eventApiSlice";
import EventTile from "../events/EventTile";
import CompetitionTile from "../competitions/CompetitionTile";
import {EditButton} from "../../components/controls/EditButton";
import React, {useEffect, useState} from "react";
import {getArtworkUrl, getToastMessage} from "../../app/utils";
import {toast} from "react-toastify";
import {ErrorMessage} from "../../components/ErrorMessage";
import {SoftLoadImage} from "../../components/SoftLoadImage";
import {GeneralEditor} from "../edit-wizard/GeneralEditor";
import {useDispatch, useSelector} from "react-redux";
import {
    addTeamColor,
    addTeamSynonym,
    beginEditingTeam,
    deleteTeamColor,
    deleteTeamSynonym,
    editNewSynonym,
    editTeamTitle,
    selectEditedTeam,
    selectEditedTeamForUpload,
    selectTeamArtwork,
    setTeamColor,
    setTeamCountry,
    uploadTeamArtwork
} from "./teamSlice";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {EditWizard, EditWizardDisplay, EditWizardMenu} from "../edit-wizard/EditWizard";
import {WizardMenuItem} from "../edit-wizard/WizardMenuItem";
import {CancelButton} from "../../components/controls/CancelButton";
import {SaveButton} from "../../components/controls/SaveButton";
import {ArtworkEditor} from "../edit-wizard/ArtworkEditor";
import {ColorsEditor} from "../edit-wizard/ColorsEditor";


export const TeamDetails = () => {

    // wizards
    const GENERAL = 'general'
    const EMBLEM = 'emblem'
    const FANART = 'fanart'
    const COLORS = 'colors'

    // handlers
    const onClickEditButton = (e) => {
        e.preventDefault()
        dispatch(beginEditingTeam({team}))
        setIsEditShown(true)
    }
    const onCloseEditModal = () => {
        setIsEditShown(false)
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
        updateTeam(uploadTeam).unwrap().then(() => onCloseEditModal())
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
        dispatch(setTeamColor({ color, priority }))
    }
    const onAddTeamColor = () => {
        dispatch(addTeamColor({}))
    }
    const onDeleteTeamColor = (priority) => {
        dispatch(deleteTeamColor({priority}))
    }

    // state
    const params = useParams()
    const {teamId} = params
    let [isEditShown, setIsEditShown] = useState(false)
    let [selectedWizard, setSelectedWizard] = useState(GENERAL)
    let editedTeam = useSelector(state => selectEditedTeam(state))
    let uploadTeam = useSelector(state => selectEditedTeamForUpload(state))

    // hooks
    const dispatch = useDispatch()
    const {
        data: team,
        isLoading: isTeamLoading,
        isSuccess: isTeamSuccess,
        isError: isTeamError,
        error: teamError
    } = useFetchTeamByIdQuery(teamId)
    let name = team?.name
    const posterPlaceholder = process.env.PUBLIC_URL + '/img/default_team_emblem.png'
    const imageUrl = getArtworkUrl(team, 'emblem')
    const [
        updateTeam, {
            isLoading: isUpdatingTeam,
            isSuccess: isUpdateSuccess,
            isError: isUpdateError,
            error: updateError,
        }
    ] = useUpdateTeamMutation()
    const {
        data: matches,
        isLoading: isMatchesLoading,
        isSuccess: isMatchesSuccess,
        isError: isMatchesError,
        error: matchesError
    } = useFetchMatchesForTeamQuery(teamId)
    const {
        data: competitions,
        isLoading: isCompetitionsLoading,
        isSuccess: isCompetitionsSuccess,
        isError: isCompetitionsError,
        error: competitionsError
    } = useFetchCompetitionsForTeamQuery(teamId)

    // toast messages
    useEffect(() => {
        if (isUpdateSuccess) {
            toast('Successfully updated Team')
        }
        if (isTeamError) {
            let msg = `Failed to load Team data for ${teamId}: ` + getToastMessage(teamError);
            toast.error(msg);
        }
        if (isCompetitionsError) {
            let msg = 'Failed to load Competitions: ' + getToastMessage(competitionsError)
            toast.error(msg)
        }
        if (isMatchesError) {
            let msg = 'Failed to load Matches: ' + getToastMessage(matchesError)
            toast.error(msg)
        }
        if (isUpdateError) {
            let msg = 'Could not update Team: ' + getToastMessage(updateError)
            toast.error(msg)
        }
    }, [
        teamId, isMatchesError, matchesError, isCompetitionsError,
        competitionsError, isTeamError, teamError, isUpdateSuccess,
        isUpdateError, updateError
    ])

    // components
    let matchTiles =
            isMatchesSuccess && matches ?
                matches.map(match => <EventTile event={match} key={match['eventId']} />) :
                []
    let competitionTiles =
        isCompetitionsLoading ?
            <CenteredSpinner /> :
            isCompetitionsSuccess && competitions ?
                Object.values(competitions.entities).map(
                    competition => <CompetitionTile competition={competition} key={competition.id} />
                ) :
                null

    let wizards = {
        general:
            <GeneralEditor
                title={editedTeam.name?.name}
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
            />
    }

    return (
        <>
            {
                isTeamLoading ?
                    <FillSpinner /> :
                    isTeamSuccess ?
                        <div className="Content-container">
                            <Modal show={isEditShown}>
                                <Header onHide={onCloseEditModal}>
                                    Edit team &mdash;&nbsp;
                                    <span style={{color: '#ccc'}}>{name?.name}</span>
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
                                        </EditWizardMenu>
                                        <EditWizardDisplay>
                                            {wizards[selectedWizard]}
                                        </EditWizardDisplay>
                                    </EditWizard>
                                </Body>
                                <Footer>
                                    <CancelButton onClick={onCloseEditModal} />
                                    <SaveButton onClick={onSaveEdits} isLoading={isUpdatingTeam} />
                                </Footer>
                            </Modal>
                            <h1 className="Detail-title">{name?.name}</h1>
                            <div className="Detail-header">
                                <SoftLoadImage
                                    imageUrl={imageUrl}
                                    placeholderUrl={posterPlaceholder}
                                    alt={name?.name}
                                    className="Team-detail-poster"
                                />
                                <div className="Detail-edit-controls Team-edit-controls" onClick={onClickEditButton}>
                                    <EditButton onClick={onClickEditButton} />
                                </div>
                            </div>
                            {
                                isMatchesLoading ?
                                    <CenteredSpinner /> :
                                    <ContentBar title={"Most recent Matches"} items={matchTiles}/>
                            }
                            <h3>Competing in</h3>
                            <div className="Entity-display">
                                {competitionTiles}
                            </div>
                        </div> :
                        <ErrorMessage>Could not load Team data</ErrorMessage>
            }
        </>
    );
}
