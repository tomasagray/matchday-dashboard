import React from "react";
import {UserList} from "./UserList";
import {useParams} from "react-router-dom";
import {useGetFileServerUsersQuery} from "./fileServerUserApiSlice";
import {Spinner} from "../../components/Spinner";
import {useSelector} from "react-redux";
import {selectFileServerPluginById} from "./fileServerPluginSlice";
import {PluginId} from "../../components/PluginId";
import {useGetAllFileServerPluginsQuery} from "./fileServerPluginApiSlice";

export const FileServerUserList = (props) => {

    const params = useParams()
    let {pluginId} = params
    let {data: users, isLoading, isSuccess} = useGetFileServerUsersQuery(pluginId)
    let {isLoading: pluginsLoading, isSuccess: pluginSuccess} = useGetAllFileServerPluginsQuery()
    let plugin = useSelector(state => selectFileServerPluginById(state, pluginId))
    console.log('plugin', plugin)

    let pluginTitle =
        pluginsLoading ? <Spinner size={32} text={''}/> :
            pluginSuccess ?
            <h1>{plugin.title}</h1> :
                null
    let pluginUserList =
        isSuccess ? <UserList users={Object.values(users.entities)}/> :
            isLoading ? <Spinner /> :
                <p>There are no users</p>

    return (
        <div>
            <div className="Banner-title">
                {pluginTitle}
                <PluginId id={pluginId}/>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h2>Users</h2>
                <button className={"Small-button"}>Add User...</button>
            </div>
            <div>
                {pluginUserList}
            </div>
        </div>
    )
}
