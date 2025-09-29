import React, {useEffect, useState} from "react";
import {SoftLoadImage} from "../../components/SoftLoadImage";
import {CenteredSpinner} from "../../components/Spinner";
import DatePicker from "react-datepicker";
import {CompetitionSelect} from "./CompetitionSelect";
import {EditWizard, EditWizardDisplay, EditWizardMenu} from "../edit-wizard/EditWizard";
import {WizardMenuItem} from "../edit-wizard/WizardMenuItem";
import {useDispatch, useSelector} from "react-redux";
import {deleteVideoSource, selectEditedMatch, updateEditedMatch} from "../../slices/matchSlice";
import {useRefreshMatchArtworkMutation} from "../../slices/api/eventApiSlice";
import {formatDateTime, getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {TeamSelect} from "./TeamSelect";
import {DeleteWizard} from "../edit-wizard/DeleteWizard";
import {AddNewButton} from "../../components/controls/AddNewButton";
import {AddEditVideoSource} from "./AddEditVideoSource";
import {beganEditingVideoSource, videoSourceDialogFinished} from "../../slices/videoSourceSlice";
import {ClearButton} from "../../components/controls/ClearButton";


const POSTER_PLACEHOLDER = '/img/default_event_poster.png'
const SEASON_START_MONTH = 8;
const SEASON_START_DAY = 1;

const getPosterUrl = (editedMatch) => {
    if (editedMatch) {
        let {_links: links} = editedMatch
        if (links) {
            return links.artwork?.href ?? '/img/default_event_poster.png'
        }
    }
}

const computeSeason = (datetime) => {
    let date = new Date(datetime)
    let year = date.getFullYear()
    let startYear, endYear
    if (date.getMonth() >= SEASON_START_MONTH && date.getDay() >= SEASON_START_DAY) {
        startYear = year
        endYear = year + 1
    } else {
        startYear = year - 1
        endYear = year
    }
    return {
        startDate: new Date(startYear, SEASON_START_MONTH, SEASON_START_DAY),
        endDate: new Date(endYear, SEASON_START_MONTH - 1, 28)
    }
}

const SeasonDisplay = (props) => {
    let {season} = props
    return (
        <>
            <span style={{color: '#888', fontStyle: 'italic'}}>
                {
                    season ?
                        new Date(season.startDate).getFullYear()
                        + ` — `
                        + new Date(season.endDate).getFullYear() :
                        '?'
                }
            </span>
        </>
    )
}

export const AddEditMatchWizard = (props) => {

    // wizards
    const METADATA = 'metadata'
    const COMPETITION = 'competition'
    const TEAMS = 'teams'
    const VIDEO = 'video'
    const DELETE = 'delete'

    // handlers
    const dispatch = useDispatch()
    const onSelectEditWizard = (wizard) => () => {
        setSelectedWizard(wizard)
    }
    const onSelectDate = (date) => {
        // set date
        let formattedDate = formatDateTime(date)
        dispatch(updateEditedMatch({field: 'date', value: formattedDate}))
        setEventDate(date)
        // set season
        let season = computeSeason(formattedDate)
        dispatch(updateEditedMatch({field: 'season', value: season}))
        console.log('smaller year', season['startYear'] % 100)
    }
    const onEditFixture = (e) => {
        let fixture = {
            fixtureNumber: e.target.value
        }
        dispatch(updateEditedMatch({field: 'fixture', value: fixture}))
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
    const onAddVideoSource = () => {
        setIsAddVideoShown(true)
    }
    const onHideAddVideoSource = () => {
        setIsAddVideoShown(false)
        dispatch(videoSourceDialogFinished())
    }
    const onEditVideoSource = (source) => {
        dispatch(beganEditingVideoSource(source))
        setIsAddVideoShown(true)
    }
    const onDeleteVideoSource = (source) => {
        dispatch(deleteVideoSource(source))
    }

    // state
    let {eventId, onDelete} = props
    let isAddNew = eventId === undefined
    let [selectedWizard, setSelectedWizard] = useState(METADATA)
    let [eventDate, setEventDate] = useState(null)
    let editedMatch = useSelector(state => selectEditedMatch(state))
    let posterUrl = getPosterUrl(editedMatch)
    let matchDate = editedMatch != null ? Date.parse(editedMatch.date) : null
    let [isAddVideoShown, setIsAddVideoShown] = useState(false)

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
            <div className="Event-metadata-container">
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                    <h3 style={{marginRight: '1rem'}}>Artwork</h3>
                    <button className="Small-button" onClick={onRefreshArtwork} disabled={isAddNew}>
                        Refresh
                    </button>
                </div>
                <div style={{display: 'flex'}}>
                    <div className="Refresh-event-artwork-container">
                        <div className="Event-editor-artwork">
                            <SoftLoadImage placeholderUrl={POSTER_PLACEHOLDER}
                                           imageUrl={posterUrl}/>
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
                <div className="Event-additional-metadata-container">
                    <div>
                        <h4>Date</h4>
                        <DatePicker selected={eventDate} onChange={(date) => onSelectDate(date)}/>
                    </div>
                    <div>
                        <h4>Season</h4>
                        <SeasonDisplay season={editedMatch.season}/>
                    </div>
                    <div>
                        <h4>Fixture</h4>
                        <input type="number"
                               min={0}
                               max={50}
                               size={4}
                               id="event-fixture"
                               name="event-fixture"
                               value={editedMatch?.fixture?.fixtureNumber ?? 1}
                               onChange={onEditFixture}
                        />
                    </div>
                </div>
            </div>,
        competition:
            <div style={{height: '100%'}}>
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
        video:
            <div>
                <AddEditVideoSource
                    isShown={isAddVideoShown}
                    onHide={onHideAddVideoSource}/>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3>Video Sources</h3>
                    <AddNewButton onClick={onAddVideoSource}/>
                </div>
                <ul className={'Video-source-list'}>
                    {
                        editedMatch.fileSources.length === 0 ?
                            <li style={{color: '#888'}}>
                                There are no video sources for this match.
                            </li> :
                            editedMatch.fileSources.map(source =>
                                <li className={'Video-source-list-item'} key={source.id}>
                                    <div>
                                        <button onClick={() => onEditVideoSource(source)}>
                                            {source.channel} &mdash;&nbsp;
                                            {source.resolution}&nbsp;
                                            ({source.languages}, ~{source.filesize}GB)
                                        </button>
                                    </div>
                                    <span>
                                        <ClearButton onClick={() => onDeleteVideoSource(source)}/>
                                    </span>
                                </li>
                            )
                    }
                </ul>
            </div>,
        delete:
            <DeleteWizard
                entityName={editedMatch?.title}
                placeholderUrl={POSTER_PLACEHOLDER}
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
                    {
                        isAddNew ?
                            <WizardMenuItem
                                imgSrc="/img/icon/video-source/video-source_32.png"
                                onClick={onSelectEditWizard(VIDEO)}
                                selected={selectedWizard === VIDEO}>
                                Video Sources
                            </WizardMenuItem> :
                            <WizardMenuItem
                                imgSrc="/img/icon/delete/delete_16.png"
                                onClick={onSelectEditWizard(DELETE)}
                                selected={selectedWizard === DELETE}>
                                Delete
                            </WizardMenuItem>
                    }
                </EditWizardMenu>
                <EditWizardDisplay>
                    {wizards[selectedWizard]}
                </EditWizardDisplay>
            </EditWizard>
        </>
    )
}
