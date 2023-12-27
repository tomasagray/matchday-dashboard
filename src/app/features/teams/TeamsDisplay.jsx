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
import {AddNewButton} from "../../components/controls/AddNewButton";
import {AddEditTeamWizard} from "./AddEditTeamWizard";


export const TeamsDisplay = () => {

    // handlers
    const onShowAddModal = () => {
        setIsAddModalShown(true)
    }

    // state
    let [isAddModalShown, setIsAddModalShown] = useState(false)
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

    // toast messages
    useEffect(() => {
        if (isError) {
            let msg = 'Could not load Teams data: ' + getToastMessage(error)
            toast.error(msg)
        }
    }, [error, isError])

    return (
        <>
            <AddEditTeamWizard
                isShown={isAddModalShown}
                setIsShown={setIsAddModalShown}
            />
            {
                isError ?
                    <ErrorMessage>Could not load Teams data</ErrorMessage> :
                    isLoading ?
                        <FillSpinner/> :
                        isSuccess ?
                            teams && Object.keys(teams.entities).length > 0 ?
                                <div>
                                    <div className={'Entity-header'}>
                                        <h1>Teams</h1>
                                        <AddNewButton onClick={onShowAddModal}/>
                                    </div>
                                    <div className={"Entity-display"}>
                                        {
                                            Object.values(teams.entities)
                                                .sort((t1, t2) => t1.name.name.localeCompare(t2.name.name))
                                                .map(team => <TeamTile team={team} key={team.id}/>)
                                        }
                                    </div>
                                </div> :
                                <EmptyMessage noun={'teams'}/> :
                            null
            }
        </>
    )
}
