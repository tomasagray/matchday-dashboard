import React, {useEffect} from "react";
import {useFetchAllTeamsQuery} from "./teamApiSlice";
import {FillSpinner} from "../../components/Spinner";
import TeamTile from "./TeamTile";
import {ErrorMessage} from "../../components/ErrorMessage";
import {getToastMessage} from "../../app/utils";
import {toast} from "react-toastify";

export const TeamsDisplay = () => {

    const {
        data: teams,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFetchAllTeamsQuery()

    useEffect(() => {
        if (isError) {
            let msg = 'Could not load Teams data: ' + getToastMessage(error)
            toast.error(msg)
        }
    })

    return (
        <>
            {
                isLoading ?
                    <FillSpinner /> :
                    isSuccess ?
                        <div>
                            <h1>Teams</h1>
                            <div className={"Entity-display"}>
                                {
                                    Object.values(teams.entities).map(team =>
                                        <TeamTile team={team} key={team.id} />
                                    )
                                }
                            </div>
                        </div> :
                        <ErrorMessage>Could not load Teams data</ErrorMessage>
            }
        </>
    )
}
