import React from "react";
import {useAppInfoQuery} from "../../slices/api/adminApiSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";

export const About = () => {

    const {
        data,
        isLoading,
        isSuccess,
        error,
    } = useAppInfoQuery()

    return (
        <>
            <h1>About</h1>
            <p style={{padding: '1rem 0', color: '#aaa'}}>Matchday server</p>
            {
                isLoading ?
                    <CenteredSpinner/> :
                    isSuccess ?
                        <table className="About-table">
                            <tbody>
                            <tr>
                                <td>PID</td>
                                <td>{data.pid}</td>
                            </tr>
                            <tr>
                                <td>Version</td>
                                <td>{data.version}</td>
                            </tr>
                            <tr>
                                <td>System</td>
                                <td>{data.system}</td>
                            </tr>
                            </tbody>
                        </table> :
                        <ErrorMessage>{error}</ErrorMessage>
            }
        </>
    )
}