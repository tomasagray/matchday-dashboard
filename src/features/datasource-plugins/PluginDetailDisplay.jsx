import {Status, ToggleSwitch} from "../../components/controls/ToggleSwitch";
import React from "react";
import {useSelector} from "react-redux";
import {useDisableDataSourcePluginMutation, useEnableDataSourcePluginMutation} from "./dataSourcePluginApiSlice";
import {selectDataSourcePluginById} from "./dataSourcePluginSlice";
import {SettingContainer} from "../../components/SettingContainer";
import {SettingsGroup} from "../../components/SettingsGroup";
import {SettingsLink} from "../../components/SettingsLink";

export const PluginDetailDisplay = () => {

    const [enablePlugin, {isLoading: enableIsLoading}] = useEnableDataSourcePluginMutation()
    const [disablePlugin, {isLoading: disableIsLoading}] = useDisableDataSourcePluginMutation()
    const selectedPluginId = useSelector(state => state.dataSourcePlugins.selectedPluginId)
    const plugin = useSelector(state => selectDataSourcePluginById(state, selectedPluginId))
    let toggle = Status().Unchecked

    // handle toggle switch rendering
    if (enableIsLoading || disableIsLoading) {
        toggle = Status().Transitioning
    } else if (plugin) {
        if (plugin.enabled) {
            toggle = Status().Checked
        } else {
            toggle = Status().Unchecked
        }
    }

    const showEnabled = async (plugin) => {
        return await enablePlugin(plugin.id)
    };
    const showDisabled = async (plugin) => {
        return await disablePlugin(plugin.id)
    }
    const onEnabledToggle = async () => {
        if (plugin && !enableIsLoading && !disableIsLoading) {
            let result
            if (plugin.enabled) {
                result = await showDisabled(plugin)
            } else {
                result = await showEnabled(plugin)
            }
            if (result.error) {
                // todo - how to display errors?
                console.log('got an error', result)
            }
        }
    }

    return (
        <>
            <SettingsGroup>
                <p style={{margin: '2rem 0'}}>{plugin.description}</p>
                <SettingContainer>
                    <p>Enabled</p>
                    <ToggleSwitch status={toggle} onclick={onEnabledToggle}/>
                </SettingContainer>
                <SettingsLink title="Data Sources" location={"/data-sources/data-source/" + plugin.id}/>
            </SettingsGroup>
        </>
    )
}
