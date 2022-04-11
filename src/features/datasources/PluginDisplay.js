import {Status, ToggleSwitch} from "../../components/ToggleSwitch";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    disableSelectedPlugin,
    enableSelectedPlugin,
    useDisableDataSourcePluginMutation,
    useEnableDataSourcePluginMutation
} from "./dataSourcesSlice";
import {SettingContainer} from "../../components/SettingContainer";
import {SettingsGroup} from "../../components/SettingsGroup";

export const PluginDisplay = () => {
    const [enablePlugin, {isLoading: enableIsLoading}] = useEnableDataSourcePluginMutation()
    const [disablePlugin, {isLoading: disableIsLoading}] = useDisableDataSourcePluginMutation()
    const plugin = useSelector(state => state.datasources.selectedPlugin)
    const dispatch = useDispatch()
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
        let result = await enablePlugin(plugin.id)
        if (!result.error) {
            dispatch(enableSelectedPlugin(plugin))
        }
        return result
    };

    const showDisabled = async (plugin) => {
        let result = await disablePlugin(plugin.id)
        if (!result.error) {
            dispatch(disableSelectedPlugin(plugin))
        }
        return result
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
                    <p><strong>Enabled</strong></p>
                    <ToggleSwitch status={toggle} onclick={onEnabledToggle}/>
                </SettingContainer>
            </SettingsGroup>
        </>
    )
}
