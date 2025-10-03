import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from "react-redux";
import {FillSpinner} from "../../components/Spinner";
import {
    useGetAllDataSourcePluginsQuery,
    useRefreshAllDataSourcePluginsMutation,
    useRefreshDataSourcesOnUrlMutation
} from "../../slices/api/dataSourcePluginApiSlice";
import {PluginDetailDisplay} from "./PluginDetailDisplay";
import {ErrorMessage} from "../../components/ErrorMessage";
import {DataSourcePluginTile} from "./DataSourcePluginTile";
import {ClearButton} from "../../components/controls/ClearButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {getToastMessage, setBackgroundImage} from "../../utils";
import {LabelRefreshTool} from "./LabelRefreshTool";
import {InfoMessage} from "../../components/InfoMessage";
import {UrlRefreshTool} from "./UrlRefreshTool";
import {selectSelectedPlugin} from "../../slices/dataSourcePluginSlice";

const DEFAULT_LABEL = ''
const DEFAULT_DATE = new Date()
const LABEL_MODE = 'label'
const DATE_MODE = 'date'
const URL_MODE = 'url'

export const DataSourcePluginsList = () => {

    // handlers
    const onRefreshHover = () => setRefreshHover(true)
    const onRefreshUnHover = () => setRefreshHover(false)
    const onShowLabelRefresh = (e) => {
        e.preventDefault()
        setRefreshMode(LABEL_MODE)
        const label = labelRef.current
        label?.focus()
    }
    const updateRefreshLabel = (e) => setRefreshLabel(e.target.value)
    const onShowDatePicker = (e) => {
        e.preventDefault()
        setRefreshMode(DATE_MODE)
    }
    const onShowUrlRefresh = (e) => {
        e.preventDefault()
        setRefreshMode(URL_MODE)
    }
    const onUpdateRefreshUrl = (e) => setRefreshUrl(e.target.value)
    const onClearRefreshTool = () => {
        setRefreshMode(null)
        setRefreshLabel(DEFAULT_LABEL)
        setRefreshDate(DEFAULT_DATE)
        setRefreshUrl('')
    }
    const onRefreshAllPlugins = async () => {
        onClearRefreshTool()
        if (refreshMode === URL_MODE) {
            await refreshOnUrl(refreshUrl)
        } else {
            const query = getRefreshQuery()
            await refreshAllPlugins(query)
        }
    }
    const getRefreshQuery = () => {
        const startDate = refreshDate != null ?
            dayjs(new Date(refreshDate)).format('YYYY-MM-DDThh:mm:ss') :
            null
        return {
            labels: [refreshLabel],
            startDate,
        }
    }

    // hooks
    const {
        data: dataSourcePlugins,
        isLoading: pluginsLoading,
        isSuccess: pluginLoaded,
        isError: isPluginError,
        error: pluginError
    } = useGetAllDataSourcePluginsQuery()
    const [refreshAllPlugins, {
        isLoading: refreshing,
        isSuccess: isRefreshSuccess,
        isError: isRefreshError,
        error: refreshError
    }] = useRefreshAllDataSourcePluginsMutation()
    const [refreshOnUrl, {
        isLoading: urlRefreshing,
        isSuccess: isUrlRefreshSuccess,
        isError: isUrlRefreshError,
        error: urlRefreshError
    }] = useRefreshDataSourcesOnUrlMutation()

    // toast messages
    useEffect(() => {
        // success
        if (isRefreshSuccess || isUrlRefreshSuccess) {
            toast('Data sources successfully refreshed')
        }
        // error
        if (isPluginError) {
            let msg = 'Error fetching data source plugins: ' + getToastMessage(pluginError)
            toast.error(msg)
        }
        if (isRefreshError) {
            let msg = 'Error refreshing data sources: ' + getToastMessage(refreshError)
            toast.error(msg)
        }
        if (isUrlRefreshError) {
            let msg = 'Error refreshing data sources: ' + getToastMessage(urlRefreshError)
            toast.error(msg)
        }
    }, [
        isRefreshSuccess,
        isRefreshError,
        isUrlRefreshSuccess,
        isUrlRefreshError,
        refreshError,
        urlRefreshError,
        isPluginError,
        pluginError
    ])

    // state
    const selectedPlugin = useSelector(state => selectSelectedPlugin(state))
    let [refreshHover, setRefreshHover] = useState(false)
    let [refreshMode, setRefreshMode] = useState(null)
    let [refreshLabel, setRefreshLabel] = useState(DEFAULT_LABEL)
    let [refreshDate, setRefreshDate] = useState(DEFAULT_DATE)
    let [refreshUrl, setRefreshUrl] = useState('')
    const labelRef = useRef(null)

    // components
    let pluginList
    if (pluginLoaded) {
        pluginList = dataSourcePlugins.map(plugin =>
            <DataSourcePluginTile
                key={plugin.id}
                active={selectedPlugin !== null && plugin.id === selectedPlugin}
                plugin={plugin}/>
        )
    } else if (isPluginError) {
        pluginList = <ErrorMessage code={pluginError.status}>{pluginError.error}</ErrorMessage>
    }

    let pluginData
    if (selectedPlugin && !pluginsLoading) {
        pluginData = <PluginDetailDisplay plugin={selectedPlugin}/>
    } else if (pluginLoaded) {
        pluginData = <InfoMessage>Please select a Data Source plugin from above.</InfoMessage>
    }

    // refresh tools
    const getRefreshTool = (refreshMode) => {
        switch (refreshMode) {
            case LABEL_MODE:
                return (
                    <LabelRefreshTool
                        refreshLabel={refreshLabel}
                        onUpdateRefreshLabel={updateRefreshLabel}
                        onClearRefreshLabel={onClearRefreshTool}
                        onSubmit={onRefreshAllPlugins}
                    />
                )
            case DATE_MODE:
                return (
                    <div className={"Refresh-tool-container"}>
                        <DatePicker selected={refreshDate} onChange={(date) => setRefreshDate(date)}/>
                        <ClearButton onClick={onClearRefreshTool}/>
                    </div>
                )
            case URL_MODE:
                return (
                    <UrlRefreshTool
                        refreshUrl={refreshUrl}
                        onUpdateRefreshUrl={onUpdateRefreshUrl}
                        onClearRefreshUrl={onClearRefreshTool}
                        onSubmit={onRefreshAllPlugins}
                    />
                )
            default:
                return (
                    <p>
                        Refresh using:
                        <button className={"Refresh-option"} onClick={onShowLabelRefresh}>Label</button> |
                        <button className={"Refresh-option"} onClick={onShowDatePicker}>Date</button> |
                        <button className={"Refresh-option"} onClick={onShowUrlRefresh}>URL</button>
                    </p>
                )
        }
    }

    let refreshDisabled = pluginsLoading || isPluginError || refreshing || urlRefreshing
    let refreshButtonStyle = pluginsLoading || refreshing || urlRefreshing ? {cursor: 'wait'} : {}
    let refreshTool = getRefreshTool(refreshMode)
    let refreshOptionsVisibility =
        (refreshHover || refreshMode === LABEL_MODE || refreshMode === DATE_MODE || refreshMode === URL_MODE)
            ? 'visible' : 'hidden'

    setBackgroundImage('none')
    return (
        <>
            {
                isPluginError ?
                    <ErrorMessage>Could not load data source plugins.</ErrorMessage> :
                    pluginsLoading ?
                        <FillSpinner/> :
                        <div>
                            <div className="section-header">
                                <img
                                    src={'/img/icon/plugins/plugins_64.png'}
                                    alt="Plugins"
                                    style={{height: 'fit-content'}}
                                />
                                <h1>Data Source Plugins</h1>
                            </div>
                            <div className={"Refresh-container"} onMouseEnter={onRefreshHover}
                                 onMouseLeave={onRefreshUnHover}>
                                <button className="Small-button"
                                        style={refreshButtonStyle}
                                        disabled={refreshDisabled}
                                        onClick={onRefreshAllPlugins}>
                                    Refresh All
                                </button>
                                <div className={"Refresh-options-container"}
                                     style={{visibility: refreshOptionsVisibility}}>
                                    {refreshTool}
                                </div>
                            </div>
                            <div className={"Plugin-tile-container"}>
                                {pluginList}
                            </div>
                            <div className="Plugin-details-container">
                                {pluginData}
                            </div>
                        </div>
            }
        </>
    );
}
