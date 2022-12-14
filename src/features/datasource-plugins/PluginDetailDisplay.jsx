import {Status, ToggleSwitch} from "../../components/controls/ToggleSwitch";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {
  useDisableDataSourcePluginMutation,
  useEnableDataSourcePluginMutation
} from "../../slices/api/dataSourcePluginApiSlice";
import {selectDataSourcePluginById} from "../../slices/dataSourcePluginSlice";
import {SettingContainer} from "../../components/SettingContainer";
import {SettingsGroup} from "../../components/SettingsGroup";
import {SettingsLink} from "../../components/SettingsLink";
import {toast} from "react-toastify";
import {getToastMessage} from "../../app/utils";

export const PluginDetailDisplay = () => {

    const onEnabledToggle = () => {
        if (plugin && !enableIsLoading && !disableIsLoading) {
            if (plugin.enabled) {
                disablePlugin(plugin.id)
            } else {
                enablePlugin(plugin.id)
            }
        }
    }
    const [enablePlugin, {
        isLoading: enableIsLoading,
        isError: isEnableError,
        error: enableError
    }] = useEnableDataSourcePluginMutation()
    const [disablePlugin, {
        isLoading: disableIsLoading,
        isError: isDisableError,
        error: disableError
    }] = useDisableDataSourcePluginMutation()
    const selectedPluginId = useSelector(state => state.dataSourcePlugins.selectedPluginId)
    const plugin = useSelector(state => selectDataSourcePluginById(state, selectedPluginId))
    let toggle = Status()['Unchecked']

    // handle toggle switch rendering
    if (enableIsLoading || disableIsLoading) {
        toggle = Status()['Transitioning']
    } else if (plugin) {
        if (plugin.enabled) {
            toggle = Status()['Checked']
        } else {
            toggle = Status()['Unchecked']
        }
    }

    // error message toast
    useEffect(() => {
        if (isEnableError) {
            let msg = 'Could not enable plugin: ' + getToastMessage(enableError)
            toast.error(msg)
        }
        if (isDisableError) {
            let msg = 'Could not disable plugin: ' + getToastMessage(disableError)
            toast.error(msg)
        }
    }, [isEnableError, enableError, isDisableError, disableError])

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
