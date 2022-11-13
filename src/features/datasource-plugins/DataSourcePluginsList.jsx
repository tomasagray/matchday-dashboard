import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from "react-redux";
import {FillSpinner} from "../../components/Spinner";
import {useGetAllDataSourcePluginsQuery, useRefreshAllDataSourcePluginsMutation} from "./dataSourcePluginApiSlice";
import {PluginDetailDisplay} from "./PluginDetailDisplay";
import {ErrorMessage} from "../../components/ErrorMessage";
import {DataSourcePluginTile} from "./DataSourcePluginTile";
import {ClearButton} from "../../components/controls/ClearButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {getToastMessage} from "../../app/utils";
import {LabelRefreshTool} from "./LabelRefreshTool";
import {InfoMessage} from "../../components/InfoMessage";

const DEFAULT_LABEL = ''
const DEFAULT_DATE = null
const DATE_MODE = 'date'
const LABEL_MODE = 'label'

export const DataSourcePluginsList = () => {

    // handlers
    const onRefreshHover = () => {
        setRefreshHover(true)
    }
    const onRefreshUnHover = () => {
        setRefreshHover(false)
    }
    const onShowLabelRefresh = (e) => {
        e.preventDefault()
        setRefreshMode(LABEL_MODE)
        const label = labelRef.current
        label?.focus()
    }
    const updateRefreshLabel = (e) => {
        setRefreshLabel(e.target.value)
    }
    const onShowDatePicker = (e) => {
        e.preventDefault()
        setRefreshMode(DATE_MODE)
    }
    const onClearRefreshTool = () => {
        setRefreshMode(null)
        setRefreshLabel(DEFAULT_LABEL)
        setRefreshDate(DEFAULT_DATE)
    }
    const onRefreshAllPlugins = async () => {
        onClearRefreshTool()
        const query = getRefreshQuery()
        await refreshAllPlugins(query)
    }
    const getRefreshQuery = () => {
        const endDate = refreshDate != null ?
            dayjs(new Date().parseIso(refreshDate)).format( 'YYYY-MM-DDThh:mm:ss') :
            null
        return {
            labels: [refreshLabel],
            endDate,
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
    
    // toast messages
    useEffect(() => {
        // success
        if (isRefreshSuccess) {
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
    }, [
        isRefreshSuccess,
        isRefreshError,
        refreshError,
        isPluginError,
        pluginError
    ])
    
    // state
    const selectedPluginId = useSelector(state => state['dataSourcePlugins']['selectedPluginId'])
    let [refreshHover, setRefreshHover] = useState(false)
    let [refreshMode, setRefreshMode] = useState(null)
    let [refreshLabel, setRefreshLabel] = useState(DEFAULT_LABEL)
    let [refreshDate, setRefreshDate] = useState(DEFAULT_DATE)
    const labelRef = useRef(null)

    // components
    let pluginList
    if (pluginLoaded) {
        pluginList = dataSourcePlugins.ids.map(pluginId => {
            let active = selectedPluginId !== null && pluginId === selectedPluginId
            return <DataSourcePluginTile key={pluginId} active={active} pluginId={pluginId}/>;
        })
    } else if (isPluginError) {
        pluginList = <ErrorMessage code={pluginError.status}>{pluginError.error}</ErrorMessage>
    }

    let pluginData
    if (selectedPluginId && !pluginsLoading) {
        pluginData = <PluginDetailDisplay plugin={selectedPluginId}/>
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
            default:
                return (
                    <p>
                        Refresh using:
                        <button className={"Refresh-option"} onClick={onShowLabelRefresh}>Label</button> |
                        <button className={"Refresh-option"} onClick={onShowDatePicker}>Date</button>
                    </p>
                )
        }
    }

    let refreshDisabled = pluginsLoading || isPluginError || refreshing;
    let refreshButtonStyle = pluginsLoading || refreshing ? {cursor: 'wait'} : {}
    let refreshTool = getRefreshTool(refreshMode)
    let refreshOptionsVisibility =
        (refreshHover || refreshMode === LABEL_MODE || refreshMode === DATE_MODE) ? 'visible' : 'hidden'

    return (
        <>
            {
                pluginsLoading ?
                    <FillSpinner /> :
                    <div>
                        <div className="section-header">
                            <img
                                src={process.env.PUBLIC_URL + '/img/icon/plugins/plugins_64.png'}
                                alt="Plugins"
                                style={{height: 'fit-content'}}
                            />
                            <h1>Data Source Plugins</h1>
                        </div>
                        <div className={"Refresh-container"} onMouseEnter={onRefreshHover} onMouseLeave={onRefreshUnHover}>
                            <button className="Small-button" style={refreshButtonStyle} disabled={refreshDisabled}
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
