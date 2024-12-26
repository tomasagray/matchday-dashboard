import React, {useEffect, useState} from "react";
import {
    useFetchSettingsQuery,
    useGetLogLevelQuery,
    useSetLogLevelMutation,
    useUpdateSettingsMutation
} from "../../slices/api/adminApiSlice";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {SaveButton} from "../../components/controls/SaveButton";
import {useDispatch, useSelector} from "react-redux";
import {
    addNewFFmpegArg,
    ARTWORK_LOCATION,
    BACKUP_LOCATION,
    deleteFFmpegArg,
    editSettings,
    FFMPEG_ARGS,
    loadSettings,
    LOG_FILE,
    PRUNE_VIDEOS,
    REFRESH_DATASOURCES,
    selectEditedSettings,
    selectUploadSettings,
    UNPROTECTED_IP,
    VIDEO_EXPIRE_DAYS,
    VIDEO_LOCATION,
    VPN_HEARTBEAT
} from "../../slices/settingsSlice";
import {ApplicationSetting} from "./ApplicationSetting";
import {CenteredSpinner, FillSpinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";
import {ResetButton} from "../../components/controls/ResetButton";
import cronstrue from "cronstrue";
import {SettingContainer} from "../../components/SettingContainer";
import Select from "../../components/controls/Select";
import {Option} from "../../components/controls/Option";
import {Tag, TagField} from "../../components/controls/TagField";

const getCronDescription = (cron) => {
    try {
        return <span className="Cron-description">
         {
             cron ?
                 cronstrue.toString(cron)
                 : null
         }
       </span>
    } catch (e) {
        return <span className="Cron-description error">
            {e.toString()}
        </span>
    }
}

export const Settings = () => {

    // constants
    const MIN_DAYS = 1
    const MAX_DAYS = 999

    // handlers
    const onUpdateRefreshCron = (e) => {
        let cron = {
            ...settings[REFRESH_DATASOURCES],
            data: e.target.value
        }
        dispatch(editSettings({field: REFRESH_DATASOURCES, value: cron}))
    }
    const onUpdatePruneCron = (e) => {
        let cron = {
            ...settings[PRUNE_VIDEOS],
            data: e.target.value
        }
        dispatch(editSettings({field: PRUNE_VIDEOS, value: cron}))
    }
    const onUpdatePruneDays = (e) => {
        let value = parseInt(e.target.value)
        if (value >= MIN_DAYS && value <= MAX_DAYS) {
            let days = {
                ...settings[VIDEO_EXPIRE_DAYS],
                data: value
            }
            dispatch(editSettings({field: VIDEO_EXPIRE_DAYS, value: days}))
        }
    }
    const onUpdateLogFilename = (e) => {
        let value = {
            ...settings[LOG_FILE],
            data: e.target.value
        }
        dispatch(editSettings({field: LOG_FILE, value}))
    }
    const onUpdateArtworkLocation = (e) => {
        let value = {
            ...settings[ARTWORK_LOCATION],
            data: e.target.value
        }
        dispatch(
            editSettings({field: ARTWORK_LOCATION, value}))
    }
    const onUpdateVideoLocation = (e) => {
        let value = {
            ...settings[VIDEO_LOCATION],
            data: e.target.value
        }
        dispatch(
            editSettings({field: VIDEO_LOCATION, value}))
    }
    const onUpdateBackupLocation = e => {
        let value = {
            ...settings[BACKUP_LOCATION],
            data: e.target.value
        }
        dispatch(
            editSettings({field: BACKUP_LOCATION, value})
        )
    }
    const onResetSettings = () => {
        dispatch(loadSettings(settings))
    }
    const onSaveSettings = () => {
        console.log('updating settings...', uploadSettings)
        updateSettings(uploadSettings)
        console.log('done updating')
    }
    const onChangeLogLevel = (e, level) => {
        console.log('setting log level...', level)
        let logLevel = {
            configuredLevel: level
        }
        setLogLevel(logLevel)
    }
    const getArgumentTags = (args) => {
        if (!args) return
        return args.map(arg =>
            <Tag onDelete={() => onDeleteArg(arg)} key={arg}>
                {arg}
            </Tag>
        )
    }
    const onDeleteArg = (arg) => dispatch(deleteFFmpegArg(arg))
    const onEditArgument = (arg) => setNewFFmpegArg(arg)
    const onAddArgument = (arg) => {
        dispatch(addNewFFmpegArg(arg))
        setNewFFmpegArg('')
    }
    const onUpdateVpnHeartBeat = (e) => {
        let value = {
            ...settings[VPN_HEARTBEAT],
            data: e.target.value
        }
        dispatch(
            editSettings({field: VPN_HEARTBEAT, value})
        )
    }
    const onUpdateUnprotectedIp = (e) => {
        let value = {
            ...settings[UNPROTECTED_IP],
            data: e.target.value
        }
        dispatch(
            editSettings({field: UNPROTECTED_IP, value})
        )
    }

    // hooks
    const dispatch = useDispatch()
    let {
        data: settings,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFetchSettingsQuery()
    let [
        updateSettings, {
            data: updatedSettings,
            isLoading: isUpdating,
            isSuccess: isUpdateSuccess,
            isError: isUpdateError,
            error: updateError
        }
    ] = useUpdateSettingsMutation()
    let {
        data: logLevel,
        isLoading: isLoadingLogLevel,
        isError: isLogLevelError,
        error: logLevelError
    } = useGetLogLevelQuery()
    let [
        setLogLevel, {
            isLoading: isSettingLogLevel,
            isError: isSetLogLevelError,
            error: setLogLevelError
        }
    ] = useSetLogLevelMutation()

    // toast messages
    useEffect(() => {
        if (isError) {
            let msg = 'Error loading settings: ' + getToastMessage(error)
            toast.error(msg)
        }
        if (isUpdateError) {
            let msg = 'Error updating settings: ' + getToastMessage(updateError)
            toast.error(msg)
        }
        if (isUpdateSuccess) {
            toast('Settings updated successfully')
            console.log('updated settings with', updatedSettings)
        }
        if (isSuccess) {
            dispatch(loadSettings(settings))
        }
        if (isLogLevelError) {
            let msg = 'Error changing log level: ' + getToastMessage(logLevelError)
            toast.error(msg)
        }
        if (isSetLogLevelError) {
            let msg = 'Error changing log level: ' + getToastMessage(setLogLevelError)
            toast.error(msg)
        }
    }, [dispatch, error, isError, isSuccess, isUpdateError, isUpdateSuccess,
        settings, updateError, updatedSettings, isLogLevelError, logLevelError,
        isSetLogLevelError, setLogLevelError
    ])

    // state
    const [newFFmpegArg, setNewFFmpegArg] = useState('')
    let editedSettings = useSelector(state => selectEditedSettings(state))
    let uploadSettings = useSelector(state => selectUploadSettings(state))

    let isInFlight = isLoading || isUpdating
    let isLogLevelInFlight = isLoadingLogLevel || isSettingLogLevel

    return (
        <>
            {
                isError ?
                    <ErrorMessage>Could not load application settings data.</ErrorMessage> :
                    isLoading ?
                        <FillSpinner/> :
                        <>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <h1>Settings</h1>
                                <div className="Settings-save-dialog">
                                    {
                                        JSON.stringify(settings) !== JSON.stringify(editedSettings) ?
                                            <>
                                                <ResetButton onClick={onResetSettings} disabled={isInFlight}/>
                                                <SaveButton onClick={onSaveSettings} isLoading={isInFlight}/>
                                            </> :
                                            null
                                    }
                                </div>
                            </div>
                            <SettingContainer style={{width: '450px'}}>
                                <span>Application log level</span>
                                {
                                    isLogLevelInFlight ?
                                        <CenteredSpinner/> :
                                        <Select className={'Log-level-selector'}
                                                disabled={isLogLevelError}
                                                placeholder={'Select log level'}
                                                onChange={onChangeLogLevel}
                                                selectedValue={logLevel['configuredLevel']}>
                                            <Option value={"OFF"}>OFF</Option>
                                            <Option value={"ERROR"}>ERROR</Option>
                                            <Option value={"WARN"}>WARN</Option>
                                            <Option value={"INFO"}>INFO</Option>
                                            <Option value={"DEBUG"}>DEBUG</Option>
                                            <Option value={"TRACE"}>TRACE</Option>
                                        </Select>
                                }
                            </SettingContainer>
                            <div style={{display: 'flex', flexFlow: 'wrap'}}>
                                {
                                    isLoading ?
                                        <CenteredSpinner/> :
                                        isSuccess ?
                                            <>
                                                <div className="App-settings-group">
                                                    <h3>Scheduled tasks</h3>
                                                    <p style={{color: '#888', fontStyle: 'italic'}}>cron
                                                        expressions</p>
                                                    <ApplicationSetting
                                                        type="text"
                                                        title="Refresh events"
                                                        style={{width: '164px'}}
                                                        disabled={isInFlight}
                                                        original={settings[REFRESH_DATASOURCES]?.data}
                                                        current={editedSettings[REFRESH_DATASOURCES]?.data}
                                                        onChange={onUpdateRefreshCron}>
                                                        {
                                                            getCronDescription(editedSettings[REFRESH_DATASOURCES]?.data)
                                                        }
                                                    </ApplicationSetting>
                                                    <ApplicationSetting
                                                        type="text"
                                                        title="Prune video data"
                                                        style={{width: '164px'}}
                                                        disabled={isInFlight}
                                                        original={settings[PRUNE_VIDEOS]?.data}
                                                        current={editedSettings[PRUNE_VIDEOS]?.data}
                                                        onChange={onUpdatePruneCron}>
                                                        {
                                                            getCronDescription(editedSettings[PRUNE_VIDEOS]?.data)
                                                        }
                                                        <span style={{marginLeft: '1rem', marginTop: '.5rem'}}>
                                            expires after &nbsp;
                                                            <input type="number" className={'Settings-input'
                                                                + (settings[VIDEO_EXPIRE_DAYS]
                                                                === editedSettings[VIDEO_EXPIRE_DAYS] ? ''
                                                                    : ' modified')}
                                                                   id="prune-days"
                                                                   disabled={isInFlight}
                                                                   min={MIN_DAYS} max={MAX_DAYS} style={{width: '48px'}}
                                                                   value={editedSettings[VIDEO_EXPIRE_DAYS]?.data ?? ''}
                                                                   onChange={onUpdatePruneDays}/>
                                                            &nbsp; days
                                        </span>
                                                    </ApplicationSetting>
                                                </div>
                                                <div className="App-settings-group">
                                                    <h3>Filesystem</h3>
                                                    <ApplicationSetting
                                                        type="text"
                                                        title="Log filename"
                                                        disabled={isInFlight}
                                                        original={settings[LOG_FILE]?.data}
                                                        current={editedSettings[LOG_FILE]?.data}
                                                        onChange={onUpdateLogFilename}/>
                                                    <ApplicationSetting
                                                        type="text"
                                                        title="Artwork storage location"
                                                        disabled={isInFlight}
                                                        original={settings[ARTWORK_LOCATION]?.data}
                                                        current={editedSettings[ARTWORK_LOCATION]?.data}
                                                        onChange={onUpdateArtworkLocation}/>
                                                    <ApplicationSetting
                                                        type="text"
                                                        title="Video storage location"
                                                        disabled={isInFlight}
                                                        original={settings[VIDEO_LOCATION]?.data}
                                                        current={editedSettings[VIDEO_LOCATION]?.data}
                                                        onChange={onUpdateVideoLocation}/>
                                                    <ApplicationSetting
                                                        type="text"
                                                        title="Backup Location"
                                                        disabled={isInFlight}
                                                        original={settings[BACKUP_LOCATION]?.data}
                                                        current={editedSettings[BACKUP_LOCATION]?.data}
                                                        onChange={onUpdateBackupLocation}/>
                                                </div>
                                                <div className="App-settings-group">
                                                    <h3>Video transcoding</h3>
                                                    <div className="App-setting-container">
                                                        <label htmlFor="ffmpeg-base-args-container">FFmpeg base
                                                            arguments</label>
                                                        <TagField id="ffmpeg-base-args-container"
                                                                  editorValue={newFFmpegArg}
                                                                  onEditTag={onEditArgument} onAddTag={onAddArgument}>
                                                            {
                                                                getArgumentTags(editedSettings[FFMPEG_ARGS]?.data)
                                                            }
                                                        </TagField>
                                                    </div>
                                                </div>
                                                <div className="App-settings-group">
                                                    <h3>VPN</h3>
                                                    <div className="App-setting-container">
                                                        <ApplicationSetting
                                                            type="text"
                                                            title="Heartbeat check"
                                                            disabled={isInFlight}
                                                            original={settings[VPN_HEARTBEAT]?.data}
                                                            current={editedSettings[VPN_HEARTBEAT]?.data}
                                                            onChange={onUpdateVpnHeartBeat}>
                                                            {
                                                                getCronDescription(editedSettings[VPN_HEARTBEAT]?.data)
                                                            }
                                                        </ApplicationSetting>
                                                        <ApplicationSetting
                                                            type="text"
                                                            title="Unprotected IP"
                                                            disabled={isInFlight}
                                                            original={settings[UNPROTECTED_IP]?.data}
                                                            current={editedSettings[UNPROTECTED_IP]?.data}
                                                            onChange={onUpdateUnprotectedIp}/>
                                                    </div>
                                                </div>
                                            </> :
                                            <ErrorMessage>
                                                Could not load application settings
                                            </ErrorMessage>
                                }
                            </div>
                            <div style={{minHeight: '5rem'}}>
                                {/*  spacer  */}
                                &nbsp;
                            </div>
                        </>
            }
        </>
    )
}
