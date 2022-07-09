import React from "react";
import {
    useDisableFileServerPluginMutation,
    useEnableFileServerPluginMutation,
    useGetAllFileServerPluginsQuery
} from "./fileServerPluginApiSlice";
import {Spinner} from "../../components/Spinner";
import {FileServerPluginTile} from "./FileServerPluginTile";
import {useSelector} from "react-redux";
import {selectFileServerPluginById, selectSelectedPluginId} from "./fileServerPluginSlice";
import {InfoMessage} from "../../components/InfoMessage";
import {SettingsGroup} from "../../components/SettingsGroup";
import {SettingContainer} from "../../components/SettingContainer";
import {Status, ToggleSwitch} from "../../components/controls/ToggleSwitch";
import {SettingsLink} from "../../components/SettingsLink";


export const FileServerPluginList = () => {

    const spinnerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '5rem'
    }

    const onTogglePluginEnabled = async () => {
        if (selectedPlugin) {
            console.log('toggling...', selectedPlugin)
            selectedPlugin.enabled ?
                await disablePlugin(selectedPlugin.id) :
                await enablePlugin(selectedPlugin.id)
        }
    }

    let {data: fileServerPlugins, isLoading, isSuccess} = useGetAllFileServerPluginsQuery()
    let [enablePlugin, {isLoading: enableLoading}] = useEnableFileServerPluginMutation()
    let [disablePlugin, {isLoading: disableLoading}] = useDisableFileServerPluginMutation()
    let selectedPluginId = useSelector(state => selectSelectedPluginId(state))
    let selectedPlugin = useSelector(state => selectFileServerPluginById(state, selectedPluginId))
    let toggle = selectedPlugin ?
        enableLoading || disableLoading ? Status().Transitioning :
            (selectedPlugin.enabled ? Status().Checked : Status().Unchecked) :
        Status().Unchecked

    let plugins = isLoading ?
        <div style={spinnerStyle}>
            <Spinner/>
        </div> :
        isSuccess ?
            Object.values(fileServerPlugins.entities)
                .map(plugin => <FileServerPluginTile pluginId={plugin.id} title={plugin.title} key={plugin.id}/>) :
            <InfoMessage style={{marginTop: '2rem'}}>There are no File Server plugins</InfoMessage>

    let pluginDetails =
        selectedPlugin ?
            <SettingsGroup>
                <p style={{margin: '2rem 0'}}>{selectedPlugin.description}</p>
                <SettingContainer>
                    <p>Enabled</p>
                    <ToggleSwitch status={toggle} onclick={onTogglePluginEnabled}/> </SettingContainer> <SettingsLink
                title={"Users"} location={`/file-servers/${selectedPluginId}/users`}/> </SettingsGroup> :
            isSuccess ?
                <InfoMessage>Please select a File Server plugin from above.</InfoMessage> :
                null


    return (
        <>
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
        </>
    );
}
