import {useGetDataSourcesForPluginQuery} from "../../slices/api/dataSourceApiSlice";
import {DataSourceDisplay} from "./DataSourceDisplay";
import {InfoMessage} from "../../components/InfoMessage";
import {FillSpinner} from "../../components/Spinner";
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
                <div style={{padding: '3rem 0'}}>
                    <InfoMessage>
                        There are currently no Data Sources for this plugin.<br/> Click above to add one
                    </InfoMessage>
                </div>
        }
    }
    if (isLoading) {
        dataSourceList = <FillSpinner/>
    }
    if (isError) {
        dataSourceList = <ErrorMessage code={error.status}>{error.message}</ErrorMessage>
    }
    return (dataSourceList)
}
