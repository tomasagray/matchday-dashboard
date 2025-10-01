import React, {useEffect, useState} from "react";
import {useFetchAllTeamsInfiniteQuery} from "../../slices/api/teamApiSlice";
import {FillSpinner} from "../../components/Spinner";
import TeamTile from "./TeamTile";
import {ErrorMessage} from "../../components/ErrorMessage";
import {getToastMessage, setBackgroundImage} from "../../utils";
import {toast} from "react-toastify";
import {useDetectElementBottom} from "../../hooks/useDetectElementBottom";
import {EmptyMessage} from "../../components/EmptyMessage";
import {AddNewButton} from "../../components/controls/AddNewButton";
import {AddEditTeamWizard} from "./AddEditTeamWizard";


export const TeamsDisplay = () => {

    // handlers
    const onShowAddModal = _ => setIsAddModalShown(true)
    const handlePageBottom = async _ => teams?.next && await fetchMoreTeams()

    // state
    let [isAddModalShown, setIsAddModalShown] = useState(false)
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        fetchNextPage: fetchMoreTeams,
    } = useFetchAllTeamsInfiniteQuery()
    const teams = data?.pages.reduce((prev, next) => {
        return {
            ids: [...prev.ids, ...next.ids],
            entities: {...prev.entities, ...next.entities},
            next: next.next,
        }
    })

    // detect end of page
    useDetectElementBottom(document.getElementById('Content-stage'), handlePageBottom)

    // toast messages
    useEffect(() => {
        if (isError) {
            let msg = 'Could not load Teams data: ' + getToastMessage(error)
            toast.error(msg)
        }
    }, [error, isError])

    setBackgroundImage('none')
    return (
        <>
            <AddEditTeamWizard
                isShown={isAddModalShown}
                onHideWizard={setIsAddModalShown}
            />
            {
                isError ?
                    <ErrorMessage>Could not load teams data.</ErrorMessage> :
                    isLoading ?
                        <FillSpinner/> :
                        isSuccess && teams && Object.keys(teams.entities).length > 0 ?
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
                            <EmptyMessage noun={'teams'}/>
            }
        </>
    )
}
