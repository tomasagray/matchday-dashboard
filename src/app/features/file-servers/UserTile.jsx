import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {newUserUpdated, selectUserById} from "../../slices/fileServerUserSlice";
import {FloatingMenu} from "../../components/FloatingMenu";
import {MenuItem} from "../../components/MenuItem";
import {
    useDeleteUserMutation,
    useGetUserBandwidthQuery,
    useLogoutUserMutation,
    useReloginUserMutation
} from "../../slices/api/fileServerUserApiSlice";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/controls/CancelButton";
import {DeleteButton} from "../../components/controls/DeleteButton";
import {CenteredSpinner, SmallSpinner} from "../../components/Spinner";
import {CookieDisplay} from "./CookieDisplay";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {ErrorMessage} from "../../components/ErrorMessage";
import {BandwidthDisplay} from "./BandwidthDisplay";

export const UserTile = (props) => {

    // handlers
    const dispatch = useDispatch()
    const onMenuButtonClick = (e) => {
        e.preventDefault()
        setEditMenuHidden(false)
    }
    const onUserLogout = async () => {
        console.log('logging out user', userId)
        setEditMenuHidden(true)
        await logoutUser(userId)
    }
    const onUserLogin = async () => {
        console.log('re-logging in user', userId, user)
        setEditMenuHidden(true)
        if (user['hasPassword']) {
            loginUser(userId)
        } else {
            dispatch(newUserUpdated({field: 'username', value: username}))
            showLoginModal()
        }
    }
    const onShowDeleteUserConfirm = () => {
        setShowDeleteUserConfirm(true)
    }
    const onHideDeleteUserConfirm = () => {
        setShowDeleteUserConfirm(false)
    }
    const onDeleteUser = async () => {
        console.log('deleting user', userId)
        await deleteUser(userId)
        setShowDeleteUserConfirm(false)
    }
    const onShowCookiesModal = () => {
        setShowCookiesModal(true)
    }
    const onHideCookiesModal = () => {
        setShowCookiesModal(false)
    }

    let {userId, showLoginModal} = props

    // hooks
    const [loginUser, {
        isLoading: isLoggingIn,
        isSuccess: isLoginSuccess,
        isError: isLoginError,
        error: loginError
    }] = useReloginUserMutation()
    const [logoutUser, {
        isLoading: isLoggingOut,
        isSuccess: isLogoutSuccess,
        isError: isLogoutError,
        error: logoutError
    }] = useLogoutUserMutation()
    const [deleteUser, {
        isLoading: isDeleting,
        isSuccess: isDeleteSuccess,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteUserMutation()
    const {
        data: bandwidth,
        isSuccess: isBandwidthSuccess,
        isLoading: isBandwidthLoading,
        isError: isBandwidthError,
        error: bandwidthError,
    } = useGetUserBandwidthQuery(userId)

    // toast messages
    useEffect(() => {
        // success
        if (isLogoutSuccess) {
            toast('User logged in successfully')
        }
        if (isLogoutSuccess) {
            toast('User successfully logged out')
        }
        if (isDeleteSuccess) {
            toast('User was deleted')
        }
        // error
        if (isLoginError) {
            let msg = 'Could not login: ' + getToastMessage(loginError);
            toast.error(msg);
        }
        if (isLogoutError) {
            let msg = 'Failed to logout: ' + getToastMessage(logoutError)
            toast.error(msg)
        }
        if (isDeleteError) {
            let msg = 'Could not delete user: ' + getToastMessage(deleteError)
            toast.error(msg)
        }
    }, [
        isLoginSuccess,
        isLogoutSuccess,
        isDeleteSuccess,
        isLoginError,
        loginError,
        isLogoutError,
        logoutError,
        isDeleteError,
        deleteError
    ])

    // state
    let user = useSelector(state => selectUserById(state, userId))
    let username = user?.username ?? '... deleting ...'
    let loggedIn = user?.loggedIn ?? false
    let [editMenuHidden, setEditMenuHidden] = useState(true)
    let [showDeleteUserConfirm, setShowDeleteUserConfirm] = useState(false)
    let [showCookiesModal, setShowCookiesModal] = useState(false)

    // components
    let logButton = loggedIn ?
        <MenuItem onClick={onUserLogout}>
            Logout <img src={process.env.PUBLIC_URL + '/img/icon/logout/logout_32.png'} alt={'Logout'}/>
        </MenuItem> :
        <MenuItem onClick={onUserLogin}>
            Login <img src={process.env.PUBLIC_URL + '/img/icon/login/login_32.png'} alt={'Login'}/>
        </MenuItem>
    let checkbox = isLoggingIn || isLoggingOut || isDeleting ?
        <SmallSpinner transform='translateY(5px) translateX(4px)'/> :
        <input type={"checkbox"} checked={loggedIn} disabled={true} className={"Logged-in-checkbox"}/>

    return (
        <div className={"User-tile Message"}>
            <Modal show={showDeleteUserConfirm}>
                <Header onHide={onHideDeleteUserConfirm}>
                    CONFIRM: <span style={{color: '#aaa'}}>Delete File Server User</span>
                </Header>
                <Body>
                    Are you sure you want to <strong style={{color: 'red'}}>PERMANENTLY DELETE</strong> this user?
                    <table className={"User-delete-details"}>
                        <tbody>
                        <tr>
                            <td>Username</td>
                            <td>{username}</td>
                        </tr>
                        <tr>
                            <td>UserID</td>
                            <td>{userId}</td>
                        </tr>
                        </tbody>
                    </table>
                </Body>
                <Footer>
                    <CancelButton onClick={onHideDeleteUserConfirm} style={{display: isDeleting ? 'none' : ''}}/>
                    <DeleteButton onClick={onDeleteUser} isLoading={isDeleting} disabled={isDeleting}/>
                </Footer>
            </Modal>
            <CookieDisplay userId={userId} show={showCookiesModal} onHide={onHideCookiesModal}/>
            <div style={{height: '100%', width: '100px'}}>
                <img width="100px" src={process.env.PUBLIC_URL + '/img/default_avatar.png'} alt=""
                     className="User-avatar"/>
            </div>
            <div className="User-data">
                <p>
                    <strong style={{fontSize: 'large'}}>{username}</strong>
                </p>
                <p style={{opacity: .5, fontSize: 'small'}}>
                    ID: <span style={{opacity: .4}}>{userId}</span>
                </p>
                <p style={{display: 'inline-flex', alignItems: 'center', width: 'fit-content'}}>
                    Logged In:
                </p>
                <div style={{
                    marginLeft: '1rem',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    width: 'fit-content'
                }}>
                    {checkbox}
                </div>
                <div>
                    Remaining bandwidth:
                    {
                        isBandwidthLoading ?
                            <CenteredSpinner/> :
                            isBandwidthSuccess ?
                                <BandwidthDisplay bandwidth={bandwidth}/> :
                                isBandwidthError ?
                                    <ErrorMessage>
                                        Remaining bandwidth unavailable:<br/>
                                        <span>
                                            {
                                                bandwidthError !== null && typeof bandwidthError === 'object' ?
                                                    bandwidthError.error :
                                                    bandwidthError
                                            }
                                        </span>
                                    </ErrorMessage> : null
                    }

                </div>
            </div>
            <div id={"user-edit-menu"} style={{float: 'right'}}>
                <button onClick={onMenuButtonClick} className={"Menu-button"}>&#8942;</button>
                <FloatingMenu hidden={editMenuHidden} onClickOutside={setEditMenuHidden}>
                    {logButton}
                    <MenuItem backgroundColor={'cornflowerblue'} onClick={onShowCookiesModal}>
                        Cookies...
                        <img src={process.env.PUBLIC_URL + '/img/icon/cookies/cookies_16.png'} alt={'Cookies'}/>
                    </MenuItem>
                    <MenuItem backgroundColor={'darkred'} onClick={onShowDeleteUserConfirm}>
                        Delete
                        <img src={process.env.PUBLIC_URL + '/img/icon/delete/delete_16.png'} alt={'Delete'}/>
                    </MenuItem>
                </FloatingMenu>
            </div>
        </div>
    )
}
