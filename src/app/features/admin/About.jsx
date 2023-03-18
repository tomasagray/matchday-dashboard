import React from "react";
import {useAppInfoQuery} from "../../slices/api/adminApiSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {ErrorMessage} from "../../components/ErrorMessage";
import properties from "../../properties";

export const About = () => {

    const version = properties.version
    const {
        data,
        isLoading,
        isSuccess,
        error,
    } = useAppInfoQuery()

    return (
        <>
            <h1>About</h1>
            <p style={{padding: '1rem 0 2rem 0', color: '#999'}}>
                <strong>Matchday server</strong> &nbsp; A simple content gathering service.
            </p>
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
                                <td>Server version</td>
                                <td>{data.version}</td>
                            </tr>
                            <tr>
                                <td>Dashboard version</td>
                                <td>{version}</td>
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