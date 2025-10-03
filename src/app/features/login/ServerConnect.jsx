import React, {useEffect, useRef, useState} from "react";
import {SmallSpinner} from "../../components/Spinner";
import {compareVersions, isValidUrl} from "../../utils";
import {useFetch} from "../../hooks/useFetch";
import {toast} from "react-toastify";
import {useCaptureEnterPressed} from "../../hooks/useCaptureEnterPressed";
import properties from "../../properties";


export const ServerConnect = (props) => {


    // handlers
    const onUpdateServerAddress = (e) => {
        let url = e.target.value
        setServerAddress(url)
        setIsAddressValid(isValidUrl(url))
    }
    const onConnectToServer = async () => {
        let connectAddress = serverAddress + '/info'
        console.log('connecting to server', connectAddress)
        await fetchData(connectAddress)
    }

    // state
    let {onConnect} = props
    let [serverAddress, setServerAddress] = useState('')
    let [isAddressValid, setIsAddressValid] = useState(false)
    let [isAddressFocused, setIsAddressFocused] = useState(false)

    // hooks
    let addressRef = useRef()
    let [fetchData, {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useFetch()
    useCaptureEnterPressed({
        ref: addressRef,
        action: onConnectToServer,
        isFocused: isAddressFocused,
    })


    useEffect(() => {
        const minVersion = properties.minimumServerVersion
        if (isSuccess) {
            if (compareVersions(data.version, minVersion) >= 0) {
                console.log('version is sufficient', data.version)
            } else {
                toast.error(`Server version [${data.version}] is insufficient! Requires at least ${minVersion}`)
            }
            onConnect && onConnect(serverAddress)
        }
        if (isError) {
            let msg = 'Could not connect: ' + error
            toast.error(msg)
        }
    }, [data, isLoading, isSuccess, isError, error, onConnect, serverAddress])


    return (
        <>
            <label htmlFor="server-address">
                Server address
            </label>
            <div style={{display: 'inline-flex', alignItems: 'center'}}>
                <input type="url" name="Matchday-server-address"
                       id="server-address"
                       placeholder="https://..."
                       value={serverAddress} onChange={onUpdateServerAddress}
                       disabled={isLoading}
                       onFocus={() => setIsAddressFocused(true)}
                       onBlur={() => setIsAddressFocused(false)}
                       ref={addressRef}
                />
                {
                    isLoading ?
                        <SmallSpinner size='24px' style={{marginLeft: '1rem'}}/> :
                        <button className="Connect-button" onClick={onConnectToServer} style={{marginLeft: '1rem'}}
                                disabled={!isAddressValid || isLoading}>
                            {
                                <img src={'/img/icon/link-arrow/link-arrow_64.png'}
                                     alt="Connect"/>
                            }
                        </button>
                }
            </div>
        </>
    )
}
