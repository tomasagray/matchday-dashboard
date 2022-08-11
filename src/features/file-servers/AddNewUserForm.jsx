import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {newUserUpdated, selectNewUser} from "./fileServerUserSlice";
import {FileUploadButton} from "../../components/controls/FileUploadButton";
import Modal, {Body, Footer, Header} from "../../components/Modal";
import {CancelButton} from "../../components/controls/CancelButton";
import {SaveButton} from "../../components/controls/SaveButton";
import {useLoginUserMutation, useUploadCredentialsMutation} from "./fileServerUserApiSlice";
import {toast} from "react-toastify";
import {getToastMessage} from "../../app/utils";

export const AddNewUserForm = (props) => {

    const dispatch = useDispatch()
    const onSetLoginMode = () => {
        setLoginMode('login')
    }
    const onSetUploadMode = () => {
        setLoginMode('upload')
    }
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
    const onClearCookieFile = (e) => {
        e.preventDefault()
        dispatch(newUserUpdated({field: 'cookieFile', value: {}}))
        setCookieFileData(new Blob())
    }
    const onSaveNewUser = async () =>{
        if (loginMode === 'login') {
            await onLoginUser()
        } else {
            await onUploadUserCredentials()
        }
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
        console.log('uploading credentials...')
        let formData = new FormData()
        formData.append('username', username.value)
        formData.append('serverId', pluginId)
        formData.append('cookies', cookieFileData)
        uploadCredentials(formData).unwrap().then(() => onHide())
    }

    let {pluginId, onHide, isShown} = props
    let newUser = useSelector(state => selectNewUser(state))
    let {username, password, cookieFile} = newUser
    let [loginMode, setLoginMode] = useState('login')
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
    let isLoginMode = loginMode === 'login' ? ' selected' : ''
    let isUploadMode = loginMode === 'upload' ? ' selected' : ''
    let isNewUserValid = username.valid && (loginMode === 'login' ? password.valid : cookieFile.valid)

    let loginForm = loginMode === 'login' ?
        // username & password mode
        <div className={"Form-row"}>
            <label htmlFor={"new-user-password"} className={"Hover-label"}>Password</label>
            <input type="password" name="new-user-password" value={password.value}
                   placeholder={"Enter the user's password"} onChange={onNewPasswordChanged}
                   autoComplete={'current-password'}/>
        </div> :
        // upload cookies mode
        <div className={"Form-row"}>
            <p style={{marginBottom: '1rem'}}>
                Select cookies file <span style={{color: '#aaa', fontSize: 'small'}}>(.txt)</span>:</p>
            <FileUploadButton accept={".txt"} value={cookieFile.value.name}
                              onChange={onBrowseCookieFile} onClear={onClearCookieFile}/>
        </div>

    return (
        <>
            <Modal show={isShown}>
                <Header onHide={onHide}>
                    Add New <span style={{color: '#aaa'}}>File Server User</span>
                </Header>
                <Body>
                    <div>
                        <h3>Enter credentials</h3>
                        <p>Enter a username & password combination, or upload credentials (i.e., cookies, etc.)</p>
                    </div>
                    <div className={"User-credential-container"}>
                        <div className={"User-credential-header"}>
                            <button onClick={onSetLoginMode} className={"Credential-header-button" + isLoginMode}>
                                Login
                            </button>
                            <button onClick={onSetUploadMode} className={"Credential-header-button" + isUploadMode}>
                                Upload credentials
                            </button>
                        </div>
                        <div className={"User-credential-display"}>
                            <form className={"Add-new-user-form"}>
                                <div className={"Form-row"}>
                                    <label htmlFor={"new-user-name"} className={"Hover-label"}>Username</label>
                                    <input type="text" name="new-user-name" value={username.value}
                                           onChange={onNewUserNameChanged} placeholder={"Enter a username or email"}
                                           autoComplete={'username'}/>
                                </div>
                                {loginForm}
                            </form>
                        </div>
                    </div>
                </Body>
                <Footer>
                    <CancelButton onClick={onHide}/>
                    <SaveButton onClick={onSaveNewUser} disabled={!isNewUserValid || isLoggingIn}
                                isLoading={isLoggingIn || isUploading}>
                        Login
                    </SaveButton>
                </Footer>
            </Modal>
        </>
    )
}
