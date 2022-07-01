import React, {useState} from 'react'
import {useSelector} from "react-redux";
import {Spinner} from "../../components/Spinner";
import {useGetAllDataSourcePluginsQuery, useRefreshAllDataSourcePluginsMutation} from "./dataSourcePluginApiSlice";
import {PluginDetailDisplay} from "./PluginDetailDisplay";
import {ErrorMessage} from "../../components/ErrorMessage";
import {DataSourcePluginTile} from "./DataSourcePluginTile";
import {ClearButton} from "../../components/ClearButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateformat from "dateformat";

const DEFAULT_LABEL = ''
const DEFAULT_DATE = new Date()

export const DataSourcePluginsList = () => {

    const onRefreshHover = () => {
        setRefreshHover(true)
    }
    const onRefreshUnHover = () => {
        setRefreshHover(false)
    }
    const onShowLabelRefresh = (e) => {
        e.preventDefault()
        setRefreshMode('label')
    }
    const updateRefreshLabel = (e) => {
        setRefreshLabel(e.target.value)
    }
    const onShowDatePicker = (e) => {
        e.preventDefault()
        console.log('show date picker here')
        setRefreshMode('date')
    }
    const onClearRefreshTool = (e) => {
        e.preventDefault()
        setRefreshMode(null)
        setRefreshLabel(DEFAULT_LABEL)
        setRefreshDate(DEFAULT_DATE)
    }
    const onRefreshAllPlugins = async (e) => {
        onClearRefreshTool(e)
        const query = getRefreshQuery()
        await refreshAllPlugins(query)
    }
    const getRefreshTool = (refreshMode) => {
        switch (refreshMode) {
            case 'label':
                return (
                    <div className={"Refresh-tool-container"}>
                        <input type="text" value={refreshLabel} onChange={updateRefreshLabel}
                               placeholder="Enter a search term"/> <ClearButton onClick={onClearRefreshTool}/>
                    </div>
                )
            case 'date':
                return (
                    <div className={"Refresh-tool-container"}>
                        <DatePicker selected={refreshDate} onChange={(date) => setRefreshDate(date)}/> <ClearButton
                        onClick={onClearRefreshTool}/>
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
    const getRefreshQuery = () => {
        return {
            labels: [refreshLabel],
            endDate: dateformat(refreshDate, "yyyy-mm-dd'T'hh:mm:ss"),
        }
    }

    const {
        data: dataSourcePlugins,
        isLoading: pluginsLoading,
        isSuccess: pluginLoaded,
        isError: pluginLoadingError,
        error: pluginError
    } = useGetAllDataSourcePluginsQuery()
    const [refreshAllPlugins, {isLoading: refreshing}] = useRefreshAllDataSourcePluginsMutation()
    const selectedPluginId = useSelector(state => state.dataSourcePlugins.selectedPluginId)
    let [refreshHover, setRefreshHover] = useState(false)
    let [refreshMode, setRefreshMode] = useState(null)
    let [refreshLabel, setRefreshLabel] = useState(DEFAULT_LABEL)
    let [refreshDate, setRefreshDate] = useState(DEFAULT_DATE)

    let pluginList
    if (pluginsLoading) {
        pluginList =
            <div className="Loading-box">
                <Spinner/>
            </div>
    } else if (pluginLoaded) {
        pluginList = dataSourcePlugins.ids.map(pluginId => {
            let active = selectedPluginId !== null && pluginId === selectedPluginId
            return <DataSourcePluginTile key={pluginId} active={active} pluginId={pluginId}/>;
        })
    } else if (pluginLoadingError) {
        pluginList = <ErrorMessage code={pluginError.status}>{pluginError.error}</ErrorMessage>
    }

    let pluginData
    if (selectedPluginId && !pluginsLoading) {
        pluginData = <PluginDetailDisplay plugin={selectedPluginId}/>
    } else if (pluginLoaded) {
        pluginData = <p>Please select a Data Source plugin from above.</p>
    }

    let refreshDisabled = pluginsLoading || pluginLoadingError || refreshing;
    let refreshButtonStyle = pluginsLoading || refreshing ? {cursor: 'wait'} : {}
    let refreshTool = getRefreshTool(refreshMode)
    let refreshOptionsVisibility =
        (refreshHover || refreshLabel !== DEFAULT_LABEL || refreshDate !== DEFAULT_DATE) ? 'visible' : 'hidden'
    return (
        <>
            <div className="section-header">
                <img src={process.env.PUBLIC_URL + '/img/icon/plugins/plugins_64.png'} alt="Plugins"
                     style={{height: 'fit-content'}}/>
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
        </>
    );
}
