import React, {useEffect, useState} from "react";
import {useFetchAllTeamsQuery} from "../../slices/api/teamApiSlice";
import {selectAllTeams} from "../../slices/teamSlice"
import {FillSpinner} from "../../components/Spinner";
import TeamTile from "./TeamTile";
import {ErrorMessage} from "../../components/ErrorMessage";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {useDetectElementBottom} from "../../hooks/useDetectElementBottom";
import {EmptyMessage} from "../../components/EmptyMessage";

export const TeamsDisplay = () => {

    let [next, setNext] = useState()
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFetchAllTeamsQuery(next)
    const nextUrl = data?.next
    let teams = useSelector(state => selectAllTeams(state))
    useDetectElementBottom(document.getElementById('Content-stage'), () => setNext(nextUrl))

    useEffect(() => {
        if (isError) {
            let msg = 'Could not load Teams data: ' + getToastMessage(error)
            toast.error(msg)
        }
    }, [error, isError])

    return (
        <>
            {
                isError ?
                    <ErrorMessage>Could not load Teams data</ErrorMessage> :
                    isLoading ?
                    <FillSpinner /> :
                    isSuccess ?
                        teams && Object.keys(teams.entities).length > 0 ?
                        <div>
                            <div className={"Entity-display"}>
                                {
                                    Object.values(teams.entities).map(team =>
                                        <TeamTile team={team} key={team.id} />
                                    )
                                }
                            </div>
                        </div> :
                        <EmptyMessage noun={'teams'}/> :
                        null
            }
        </>
    )
}
