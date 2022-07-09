import React, {useState} from "react";
import {UserList} from "./UserList";
import {useParams} from "react-router-dom";
import {useGetFileServerUsersQuery} from "./fileServerUserApiSlice";
import {Spinner} from "../../components/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {selectFileServerPluginById} from "./fileServerPluginSlice";
import {PluginId} from "../../components/PluginId";
import {useGetAllFileServerPluginsQuery} from "./fileServerPluginApiSlice";
import {AddNewUserForm} from "./AddNewUserForm";
import {newUserCleared} from "./fileServerUserSlice";

export const FileServerUserList = (props) => {

    const dispatch = useDispatch()
    const onShowAddUserModal = () => {
        setShowAddUserModal(true)
    }
    const onHideAddUserModal = () => {
        dispatch(newUserCleared())
        setShowAddUserModal(false)
    }

    const params = useParams()
    let {pluginId} = params
    let {isLoading: pluginsLoading, isSuccess: pluginSuccess} = useGetAllFileServerPluginsQuery()
    let plugin = useSelector(state => selectFileServerPluginById(state, pluginId))
    let {data: users, isLoading, isSuccess} = useGetFileServerUsersQuery(pluginId)
    let [showAddUserModal, setShowAddUserModal] = useState(false)

    let pluginTitle =
        pluginsLoading ? <Spinner size={24} text={''}/> :
            pluginSuccess ?
            <h1>{plugin.title}</h1> :
                null
    let pluginUserList =
        isSuccess ?
            <UserList users={Object.values(users.entities)} showLoginModal={onShowAddUserModal} /> :
            isLoading ?
                <div style={{margin: '5rem', display: 'flex', justifyContent: 'center'}}>
                    <Spinner />
                </div> :
                <p>There are no users</p>

    return (
        <div style={props.style}>
            <AddNewUserForm pluginId={pluginId} onHide={onHideAddUserModal} isShown={showAddUserModal} />

            <div className="Banner-title">
                {pluginTitle}
                <PluginId id={pluginId}/>
            </div>
            <div style={{display: 'flex', marginBottom: '2rem'}}>
                <h2>Users</h2>
                <button className={"Small-button"} style={{marginLeft: '5rem'}}
                        disabled={isLoading} onClick={onShowAddUserModal}>
                    Add User...
                </button>
            </div>
            <div>
                {pluginUserList}
            </div>
        </div>
    )
}
