import React, {useEffect, useState} from "react";
import {useFetchAllTeamsQuery} from "./teamApiSlice";
import {FillSpinner} from "../../components/Spinner";
import TeamTile from "./TeamTile";
import {ErrorMessage} from "../../components/ErrorMessage";
import {getToastMessage} from "../../app/utils";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {useDetectPageBottom} from "../../hooks/useDetectPageBottom";
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
    let teams = useSelector(state => state.teams)
    useDetectPageBottom(() => setNext(nextUrl))

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
