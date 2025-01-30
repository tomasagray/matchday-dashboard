import React, {useEffect} from "react";
import {
    useDisableFileServerPluginMutation,
    useEnableFileServerPluginMutation,
    useGetAllFileServerPluginsQuery
} from "../../slices/api/fileServerPluginApiSlice";
import {FillSpinner} from "../../components/Spinner";
import {FileServerPluginTile} from "./FileServerPluginTile";
import {useSelector} from "react-redux";
import {
    selectFileServerPluginById,
    selectSelectedPluginId
} from "../../slices/fileServerPluginSlice";
import {InfoMessage} from "../../components/InfoMessage";
import {SettingsGroup} from "../../components/SettingsGroup";
import {SettingContainer} from "../../components/SettingContainer";
import {Status, ToggleSwitch} from "../../components/controls/ToggleSwitch";
import {SettingsLink} from "../../components/SettingsLink";
import {getToastMessage, setBackgroundImage} from "../../utils";
import {toast} from "react-toastify";
import {ErrorMessage} from "../../components/ErrorMessage";

export const FileServerPluginList = () => {

    // handlers
    const onTogglePluginEnabled = async () => {
        if (selectedPlugin) {
            selectedPlugin.enabled ?
                await disablePlugin(selectedPlugin.id) :
                await enablePlugin(selectedPlugin.id)
        }
    }

    // hooks
    let {
        data: fileServerPlugins,
        isLoading: isPluginsLoading,
        isSuccess: isPluginsSuccess,
        isError: isPluginsError,
        error: pluginsError
    } = useGetAllFileServerPluginsQuery()
    let [enablePlugin, {
        isLoading: enableLoading,
        isError: isEnableError,
        error: enableError
    }] = useEnableFileServerPluginMutation()
    let [disablePlugin, {
        isLoading: disableLoading,
        isError: isDisableError,
        error: disableError
    }] = useDisableFileServerPluginMutation()

    // toast messages
    useEffect(() => {
        if (isPluginsError) {
            let msg = 'Failed to fetch file server plugins: ' + getToastMessage(pluginsError)
            toast.error(msg)
        }
        if (isEnableError) {
            let msg = 'Could not enable file server plugin: ' + getToastMessage(enableError);
            toast.error(msg);
        }
        if (isDisableError) {
            let msg = 'Could not disable file server plugin: ' + getToastMessage(disableError)
            toast.error(msg)
        }
    }, [
        isPluginsError,
        pluginsError,
        isEnableError,
        enableError,
        isDisableError,
        disableError
    ])

    // state
    let selectedPluginId = useSelector(state => selectSelectedPluginId(state))
    let selectedPlugin = useSelector(state => selectFileServerPluginById(state, selectedPluginId))

    // components
    let toggle = selectedPlugin ?
        enableLoading || disableLoading ? Status()['Transitioning'] :
            (selectedPlugin.enabled ? Status()['Checked'] : Status()['Unchecked']) :
        Status()['Unchecked']

    let plugins = isPluginsSuccess ?
        Object.values(fileServerPlugins.entities)
            .map(plugin =>
                <FileServerPluginTile pluginId={plugin.id} title={plugin.title} key={plugin.id}/>
            ) :
        <ErrorMessage style={{marginTop: '2rem'}}>
            Could not load file server plugins
        </ErrorMessage>

    let pluginDetails =
        selectedPlugin ?
            <SettingsGroup>
                <p style={{margin: '2rem 0'}}>{selectedPlugin.description}</p>
                <SettingContainer>
                    <p>Enabled</p>
                    <ToggleSwitch status={toggle} onclick={onTogglePluginEnabled}/> </SettingContainer> <SettingsLink
                title={"Users"} location={`/file-servers/${selectedPluginId}/users`}/> </SettingsGroup> :
            isPluginsSuccess ?
                <InfoMessage>Please select a File Server plugin from above.</InfoMessage> :
                null

    setBackgroundImage('none')
    return (
        <>
            {
                isPluginsError ?
                    <ErrorMessage>Could not load file server plugins.</ErrorMessage> :
                    isPluginsLoading ?
                        <FillSpinner/> :
                        <div>
                            <div className={"section-header"}>
                                <img src={process.env.PUBLIC_URL + '/img/icon/plugins/plugins_64.png'} alt="Plugins"
                                     style={{height: 'fit-content'}}/>
                                <h1>File Server Plugins</h1>
                            </div>
                            <div className={"Plugin-tile-container"}>
                                {plugins}
                            </div>
                            <div className={"Plugin-details-container"}>
                                {pluginDetails}
                            </div>
                        </div>
            }
        </>
    );
}
