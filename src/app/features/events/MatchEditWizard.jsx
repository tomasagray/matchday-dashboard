import React, {useEffect, useState} from "react";
import {SoftLoadImage} from "../../components/SoftLoadImage";
import {CenteredSpinner} from "../../components/Spinner";
import DatePicker from "react-datepicker";
import {CompetitionSelect} from "./CompetitionSelect";
import {
  EditWizard,
  EditWizardDisplay,
  EditWizardMenu
} from "../edit-wizard/EditWizard";
import {WizardMenuItem} from "../edit-wizard/WizardMenuItem";
import {useDispatch, useSelector} from "react-redux";
import {selectEditedMatch, updateEditedMatch} from "../../slices/matchSlice";
import {useRefreshMatchArtworkMutation} from "../../slices/api/eventApiSlice";
import {formatDateTime, getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {TeamSelect} from "./TeamSelect";
import {DeleteWizard} from "../edit-wizard/DeleteWizard";

function getPosterUrl(editedMatch) {
    if (editedMatch) {
        let {_links: links} = editedMatch
        return links.artwork.href
    }
}

export const MatchEditWizard = (props) => {

    // wizards
    const METADATA = 'metadata'
    const COMPETITION = 'competition'
    const TEAMS = 'teams'
    const DELETE = 'delete'
    
    // handlers
    const dispatch = useDispatch()
    const onSelectEditWizard = (wizard) => () => {
        setSelectedWizard(wizard)
    }
    const onSelectDate = (date) => {
        let formattedDate = formatDateTime(date)
        dispatch(updateEditedMatch({field: 'date', value: formattedDate}))
        setEventDate(date)
    }
    const onSelectCompetition = (competition) => () => {
        dispatch(updateEditedMatch({field: 'competition', value: competition}))
    }
    const onSelectHomeTeam = (team) => {
        dispatch(updateEditedMatch({field: 'homeTeam', value: team}))
    }
    const onSelectAwayTeam = (team) => {
        dispatch(updateEditedMatch({field: 'awayTeam', value: team}))
    }
    const onRefreshArtwork = async () => {
        if (!isArtworkRefreshing) {
            await refreshArtwork(eventId)
        }
    }

    // state
    const imagePlaceholderUrl = process.env.PUBLIC_URL + '/img/default_event_poster.png'
    let {eventId, onDelete} = props
    let [selectedWizard, setSelectedWizard] = useState(METADATA)
    let [eventDate, setEventDate] = useState(null)
    let editedMatch = useSelector(state => selectEditedMatch(state))
    const posterUrl = getPosterUrl(editedMatch)
    const matchDate = editedMatch != null ? Date.parse(editedMatch.date) : null

    // hooks
    const [
        refreshArtwork, {
            // data: refreshedArtwork,
            // isSuccess: isArtworkRefreshed,
            isLoading: isArtworkRefreshing,
            isError: isArtworkError,
            error: artworkError
        }] = useRefreshMatchArtworkMutation(eventId)

    // toast messages
    useEffect(() => {
        setEventDate(matchDate)
        if (isArtworkError) {
            let msg = 'Error refreshing artwork: ' + getToastMessage(artworkError)
            toast.error(msg)
        }
    }, [artworkError, isArtworkError, matchDate])
    
    // components
    let wizards = {
        metadata:
            <div className="Artwork-metadata-container">
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                    <h3 style={{marginRight: '1rem'}}>Artwork</h3>
                    <button className="Small-button" onClick={onRefreshArtwork}>
                        Refresh
                    </button>
                </div>
                <div style={{display: 'flex'}}>
                    <div className="Refresh-event-artwork-container">
                        <div className="Event-editor-artwork">
                            <SoftLoadImage placeholderUrl={imagePlaceholderUrl}
                                           imageUrl={posterUrl} />
                            {
                                isArtworkRefreshing ?
                                    <div className="Spinner-container">
                                        <CenteredSpinner/>
                                    </div> :
                                    null
                            }
                        </div>
                    </div>
                </div>
                <div style={{marginBottom: '2rem', display: 'flex', alignItems: 'center'}}>
                    <h3 style={{marginRight: '1.5rem'}}>Date</h3>
                    <DatePicker selected={eventDate} onChange={(date) => onSelectDate(date)}/>
                </div>
            </div>,
        competition:
            <div>
                <CompetitionSelect
                    onSelectCompetition={onSelectCompetition}
                    selectedCompetition={editedMatch?.competition}
                />
            </div>,
        teams:
            <div className="Team-select-wizard">
                <div className="Team-display">
                    <h3>Home Team</h3>
                    <TeamSelect
                        selectedTeam={editedMatch?.homeTeam}
                        onSelectTeam={onSelectHomeTeam}
                        key="Home-team-select"
                    />
                </div>
                <div className="Team-display">
                    <h3>Away Team</h3>
                    <TeamSelect
                        selectedTeam={editedMatch?.awayTeam}
                        onSelectTeam={onSelectAwayTeam}
                        key="Away-team-select"
                    />
                </div>
            </div>,
        delete:
            <DeleteWizard
                entityName={editedMatch?.title}
                placeholderUrl={imagePlaceholderUrl}
                imageUrl={posterUrl}
                onDelete={onDelete}
            />
    }

    return (
        <>
            <EditWizard>
                <EditWizardMenu>
                    <WizardMenuItem
                        imgSrc="/img/icon/metadata/metadata_16.png"
                        onClick={onSelectEditWizard(METADATA)}
                        selected={selectedWizard === METADATA}>
                        Metadata
                    </WizardMenuItem>
                    <WizardMenuItem
                        imgSrc="/img/icon/competitions/competitions_16.png"
                        onClick={onSelectEditWizard(COMPETITION)}
                        selected={selectedWizard === COMPETITION}>
                        Competition
                    </WizardMenuItem>
                    <WizardMenuItem
                        imgSrc="/img/icon/teams/teams_16.png"
                        onClick={onSelectEditWizard(TEAMS)}
                        selected={selectedWizard === TEAMS}>
                        Teams
                    </WizardMenuItem>
                    <WizardMenuItem
                        imgSrc="/img/icon/delete/delete_16.png"
                        onClick={onSelectEditWizard(DELETE)}
                        selected={selectedWizard === DELETE}>
                        Delete
                    </WizardMenuItem>
                </EditWizardMenu>
                <EditWizardDisplay>
                    {wizards[selectedWizard]}
                </EditWizardDisplay>
            </EditWizard>
        </>
    )
}
