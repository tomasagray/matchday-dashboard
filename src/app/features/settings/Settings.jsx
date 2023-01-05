import React, {useEffect} from "react";
import {
  useFetchSettingsQuery,
  useUpdateSettingsMutation
} from "../../slices/api/settingsApiSlice";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {CancelButton} from "../../components/controls/CancelButton";
import {SaveButton} from "../../components/controls/SaveButton";
import {useDispatch, useSelector} from "react-redux";
import {
  editSettings,
  loadSettings,
  selectEditedSettings,
  selectUploadSettings
} from "../../slices/settingsSlice";
import {ApplicationSetting} from "./ApplicationSetting";
import {CenteredSpinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";

export const Settings = () => {

  // constants
  const MIN_DAYS = 1
  const MAX_DAYS = 999

  // handlers
  const onUpdateRefreshCron = (e) => {
    dispatch(editSettings({field: 'refreshEvents', value: e.target.value}))
  }
  const onUpdatePruneCron = (e) => {
    dispatch(editSettings({field: 'pruneVideos', value: e.target.value}))
  }
  const onUpdatePruneDays = (e) => {
    let value = e.target.value
    if (value >= MIN_DAYS && value <= MAX_DAYS) {
      dispatch(editSettings({field: 'videoExpiredDays', value}))
    }
  }
  const onUpdateLogFilename = (e) => {
    dispatch(editSettings({field: 'logFilename', value: e.target.value}))
  }
  const onUpdateArtworkLocation = (e) => {
    dispatch(
        editSettings({field: 'artworkStorageLocation', value: e.target.value}))
  }
  const onUpdateVideoLocation = (e) => {
    dispatch(
        editSettings({field: 'videoStorageLocation', value: e.target.value}))
  }
  const onResetSettings = () => {
    dispatch(loadSettings({settings}))
  }
  const onSaveSettings = async () => {
    console.log('updating settings...')
    let updated = await updateSettings(uploadSettings)
    dispatch(loadSettings({updated}))
    console.log('done updating')
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
  let editedSettings = useSelector(state => selectEditedSettings(state))
  let uploadSettings = useSelector(state => selectUploadSettings(state))

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
      console.log('updated settings', updatedSettings)
    }
    if (isSuccess) {
      dispatch(loadSettings({settings}))
    }
  }, [dispatch, error, isError, isSuccess, isUpdateError, isUpdateSuccess,
    settings, updateError, updatedSettings])

  let isInFlight = isLoading || isUpdating
      return (
      <>
        <h1>Settings</h1>
        <div>
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
                            original={settings['refreshEvents']}
                            current={editedSettings['refreshEvents']}
                            onChange={onUpdateRefreshCron}/>
                        <ApplicationSetting
                            type="text"
                            title="Prune video data"
                            style={{width: '164px'}}
                            disabled={isInFlight}
                            original={settings['pruneVideos']}
                            current={editedSettings['pruneVideos']}
                            onChange={onUpdatePruneCron}>
              <span style={{marginLeft: '1rem', marginTop: '.5rem'}}>
              expires after &nbsp;
                <input type="number" className={'Settings-input'
                    + (settings['videoExpiredDays']
                    === editedSettings['videoExpiredDays'] ? ''
                        : ' modified')}
                       id="prune-days"
                       disabled={isInFlight}
                       min={MIN_DAYS} max={MAX_DAYS} style={{width: '48px'}}
                       value={editedSettings['videoExpiredDays']}
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
                            original={settings['logFilename']}
                            current={editedSettings['logFilename']}
                            onChange={onUpdateLogFilename}/>
                        <ApplicationSetting
                            type="text"
                            title="Artwork storage location"
                            disabled={isInFlight}
                            original={settings['artworkStorageLocation']}
                            current={editedSettings['artworkStorageLocation']}
                            onChange={onUpdateArtworkLocation}/>
                        <ApplicationSetting
                            type="text"
                            title="Video storage location"
                            disabled={isInFlight}
                            original={settings['videoStorageLocation']}
                            current={editedSettings['videoStorageLocation']}
                            onChange={onUpdateVideoLocation}/>
                      </div>
                    </> :
                    <ErrorMessage>
                      Could not load application settings
                    </ErrorMessage>
          }
        </div>

        <br/>
        <div className="Settings-save-dialog">
          {
            JSON.stringify(settings) !== JSON.stringify(editedSettings) ?
                <CancelButton onClick={onResetSettings} disabled={isInFlight}/>
                :
                null
          }
          <SaveButton onClick={onSaveSettings} isLoading={isInFlight}/>
        </div>
      </>
  );
}
