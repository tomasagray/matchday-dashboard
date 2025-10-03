import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {newUserUpdated, selectNewUser} from "../../slices/fileServerUserSlice";
import {FileUploadButton} from "../../components/controls/FileUploadButton";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/controls/CancelButton";
import {SaveButton} from "../../components/controls/SaveButton";
import {useLoginUserMutation, useUploadCredentialsMutation} from "../../slices/api/fileServerUserApiSlice";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import {ToggleGroup, ToggleOption} from "../../components/ToggleGroup";

export const AddNewUserForm = (props) => {

    // modes
    const USER_PASSWORD_MODE = 'login'
    const COOKIE_MODE = 'cookie'

    const dispatch = useDispatch()
    const onNewUserNameChanged = (e) => {
        let field = 'username'
        let value = e.target.value
        dispatch(newUserUpdated({field, value}))
    }
    const onNewPasswordChanged = (e) => {
        let field = 'password'
        let value = e.target.value
        dispatch(newUserUpdated({field, value}))
    }
    const onBrowseCookieFile = (e) => {
        let file = e.target.files[0]
        let field = 'cookieFile'
        let value = {
            name: file.name,
            size: file.size,
            type: file.type,
        }
        dispatch(newUserUpdated({field, value}))
        setCookieFileData(file)
    }
    const onClearCookieFile = () => {
        dispatch(newUserUpdated({field: 'cookieFile', value: {}}))
        setCookieFileData(new Blob())
    }
    const onSaveNewUser = async () => {
        if (loginMode === USER_PASSWORD_MODE) await onLoginUser()
        else await onUploadUserCredentials()
    }
    const onLoginUser = async () => {
        let user = {
            username: username.value,
            password: password.value,
            serverId: pluginId,
        }
        console.log('logging in user:', user)
        await loginUser(user)
        onHide()
    }
    const onUploadUserCredentials = async () => {
        console.log('uploading user credentials...')
        let formData = new FormData()
        formData.append('username', username.value)
        formData.append('serverId', pluginId)
        formData.append('cookies', cookieFileData)
        uploadCredentials(formData).unwrap().then(() => onHide())
    }

    let {pluginId, onHide, isShown} = props
    let newUser = useSelector(state => selectNewUser(state))
    let {username, password, cookieFile} = newUser
    let [loginMode, setLoginMode] = useState(USER_PASSWORD_MODE)
    const [loginUser, {
        isLoading: isLoggingIn,
        isSuccess: isLoginSuccess,
        isError: isLoginError,
        error: loginError
    }] = useLoginUserMutation()
    const [uploadCredentials, {
        isLoading: isUploading,
        isSuccess: isUploadSuccess,
        isError: isUploadError,
        error: uploadError
    }] = useUploadCredentialsMutation()

// toast messages
    useEffect(() => {
        if (isLoginSuccess || isUploadSuccess) {
            toast(`User ${username.value} logged in successfully`)
        }
        if (isLoginError) {
            let msg = 'Error logging in: ' + getToastMessage(loginError)
            toast.error(msg)
        }
        if (isUploadError) {
            let msg = 'Error uploading credentials: ' + getToastMessage(uploadError)
            toast.error(msg)
        }
    }, [
        username,
        isLoginSuccess,
        isLoginError,
        isUploadSuccess,
        isUploadError,
        loginError,
        uploadError
    ])

    let [cookieFileData, setCookieFileData] = useState(new Blob())
    let isNewUserValid = username.valid && (loginMode === USER_PASSWORD_MODE ? password.valid : cookieFile.valid)

    return (
        <Modal show={isShown}>
            <Header onHide={onHide}>
                Add New <span style={{color: '#aaa'}}>File Server User</span>
            </Header>
            <Body>
                <div>
                    <h3>Enter credentials</h3>
                    <p style={{color: '#888'}}>
                        Enter a username & password combination, or upload credentials (i.e., cookies, etc.)
                    </p>
                </div>
                <form className={"Add-new-user-form"}>
                    <ToggleGroup>
                        <ToggleOption title={'Login'} onSelect={() => setLoginMode(USER_PASSWORD_MODE)}>
                            <div className={"Form-row"}>
                                <label htmlFor={"new-user-name"} className={"Hover-label"}>Username</label>
                                <input type="text" name="new-user-name" value={username.value}
                                       className={username.value === '' || username.valid ? '' : 'invalid'}
                                       onChange={onNewUserNameChanged} placeholder={"Enter a username or email"}
                                       autoComplete={'username'}/>
                            </div>
                            <div className={"Form-row"}>
                                <label htmlFor={"new-user-password"} className={"Hover-label"}>
                                    Password
                                </label>
                                <input type="password" name="new-user-password" value={password.value}
                                       className={password.value === '' || password.valid ? '' : 'invalid'}
                                       placeholder={"Enter the user's password"} onChange={onNewPasswordChanged}
                                       autoComplete={'current-password'}/>
                            </div>
                        </ToggleOption>
                        <ToggleOption title={'Upload credentials'} onSelect={() => setLoginMode(COOKIE_MODE)}>
                            <div className={"Form-row"}>
                                <label htmlFor={"cookie-new-user-name"} className={"Hover-label"}>Username</label>
                                <input type="text" name="cookie-new-user-name" value={username.value}
                                       className={username.value === '' || username.valid ? '' : 'invalid'}
                                       onChange={onNewUserNameChanged} placeholder={"Enter a username or email"}
                                       autoComplete={'username'}/>
                            </div>
                            <div className={"Form-row"}>
                                <p style={{marginBottom: '1rem'}}>
                                    Select cookies file&nbsp;
                                    <span style={{color: '#aaa', fontSize: 'small'}}>(.txt)</span>:
                                </p>
                                <FileUploadButton
                                    accept={".txt"}
                                    value={cookieFile.value.name}
                                    onChange={onBrowseCookieFile}
                                    onClear={onClearCookieFile}
                                />
                            </div>
                        </ToggleOption>
                    </ToggleGroup>
                </form>
            </Body>
            <Footer>
                <CancelButton onClick={onHide}/>
                <SaveButton onClick={onSaveNewUser} disabled={!isNewUserValid || isLoggingIn}
                            isLoading={isLoggingIn || isUploading}>
                    Login
                </SaveButton>
            </Footer>
        </Modal>
    )
}
