import React, {useEffect, useState} from "react";
import {UserList} from "./UserList";
import {useParams} from "react-router-dom";
import {useGetFileServerUsersQuery} from "../../slices/api/fileServerUserApiSlice";
import {Spinner} from "../../components/Spinner";
import {useDispatch} from "react-redux";
import {PluginId} from "../../components/PluginId";
import {useGetFileServerPluginQuery} from "../../slices/api/fileServerPluginApiSlice";
import {AddNewUserForm} from "./AddNewUserForm";
import {newUserCleared} from "../../slices/fileServerUserSlice";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {InfoMessage} from "../../components/InfoMessage";


export const FileServerUserList = (props) => {

    const params = useParams()
    let {pluginId} = params

    // handlers
    const dispatch = useDispatch()
    const onShowAddUserModal = () => setShowAddUserModal(true)
    const onHideAddUserModal = () => {
        dispatch(newUserCleared())
        setShowAddUserModal(false)
    }


    // state
    let [showAddUserModal, setShowAddUserModal] = useState(false)

    // hooks
    let {
        data: plugin,
        isLoading: isPluginsLoading,
        isSuccess: isPluginSuccess,
        isError: isPluginError,
        error: pluginError
    } = useGetFileServerPluginQuery(pluginId)
    let {
        data: users,
        isLoading: isUsersLoading,
        isSuccess: isUsersSuccess,
        isError: isUsersError,
        error: usersError
    } = useGetFileServerUsersQuery(pluginId)

    // toast messages
    useEffect(() => {
        if (isPluginError) {
            let msg = 'Failed to load plugin data: ' + getToastMessage(pluginError)
            toast.error(msg)
        }
        if (isUsersError) {
            console.error(usersError)
            let msg = 'Failed to load user data: ' + getToastMessage(usersError)
            toast.error(msg)
        }
    }, [isPluginError, pluginError, isUsersError, usersError])

    // components
    let pluginTitle =
        isPluginsLoading ? <Spinner size={'24px'} text={''}/> :
            isPluginSuccess ?
                <h1>{plugin.title}</h1> :
                null
    let pluginUserList =
        isUsersSuccess && users ?
            <UserList users={Object.values(users.entities)} showLoginModal={onShowAddUserModal}/> :
            isUsersLoading ?
                <div style={{margin: '5rem', display: 'flex', justifyContent: 'center'}}>
                    <Spinner/>
                </div> :
                <InfoMessage>There are currently no users for this plugin.</InfoMessage>

    return (
        <div style={props.style}>
            <AddNewUserForm pluginId={pluginId} onHide={onHideAddUserModal} isShown={showAddUserModal}/>

            <div className="Banner-title">
                {pluginTitle}
                <PluginId id={pluginId}/>
            </div>
            <div style={{display: 'flex', marginBottom: '2rem'}}>
                <h2>Users</h2>
                <button className={"Small-button"} style={{marginLeft: '5rem'}}
                        disabled={isUsersLoading} onClick={onShowAddUserModal}>
                    Add User...
                </button>
            </div>
            <div>
                {pluginUserList}
            </div>
        </div>
    )
}
