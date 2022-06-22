import {useGetDataSourcesForPluginQuery} from "./dataSourceApiSlice";
import {DataSourceDisplay} from "./DataSourceDisplay";
import {InfoMessage} from "../../components/InfoMessage";
import {Spinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";
import React from "react";

export const DataSourceList = (props) => {

    let {pluginId} = props
    const {
        data: dataSources,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetDataSourcesForPluginQuery(pluginId)

    let dataSourceList
    if (isSuccess) {
        if (dataSources) {
            dataSourceList =
                dataSources.ids.map(dataSourceId =>
                    <DataSourceDisplay key={dataSourceId} dataSourceId={dataSourceId}/>
                )
        } else {
            dataSourceList =
                <InfoMessage> There are currently no Data Sources for this plugin.<br/> Click above to add one
                </InfoMessage>
        }
    }
    if (isLoading) {
        dataSourceList =
            <div className="loading-box">
                <Spinner/>
            </div>
    }
    if (isError) {
        dataSourceList = <ErrorMessage code={error.status}>{error}</ErrorMessage>
    }
    return (dataSourceList)
}
