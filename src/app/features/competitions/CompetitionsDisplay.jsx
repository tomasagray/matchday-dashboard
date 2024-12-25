import React, {useEffect, useState} from "react";
import {useFetchAllCompetitionsQuery} from "../../slices/api/competitionApiSlice";
import {FillSpinner} from "../../components/Spinner";
import CompetitionTile from "./CompetitionTile";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import {EmptyMessage} from "../../components/EmptyMessage";
import {AddNewButton} from "../../components/controls/AddNewButton";
import {AddEditCompetitionWizard} from "./AddEditCompetitionWizard";
import {ErrorMessage} from "../../components/ErrorMessage";


export const CompetitionsDisplay = () => {

    // handlers
    const onShowAddModal = () => {
        setIsAddModalShown(true)
    }

    // state
    let [isAddModalShown, setIsAddModalShown] = useState(false)

    // hooks
    const {
        data: competitions,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFetchAllCompetitionsQuery()

    // toast messages
    useEffect(() => {
        if (isError) {
            toast.error('Failed to load Competitions: ' + getToastMessage(error))
        }
    }, [error, isError])

    return (
        <>
            <AddEditCompetitionWizard
                isShown={isAddModalShown}
                setIsShown={setIsAddModalShown}
            />
            {
                isError ?
                    <ErrorMessage>Could not load competitions data.</ErrorMessage> :
                    isLoading ?
                        <FillSpinner/> :
                        isSuccess && competitions ?
                            <div>
                                <div className={'Entity-header'}>
                                    <h1>Competitions</h1>
                                    <AddNewButton onClick={onShowAddModal}/>
                                </div>
                                <div className="Entity-display">
                                    {
                                        Object.values(competitions.entities)
                                            .sort((c1, c2) => c1.name.name.localeCompare(c2.name.name))
                                            .map(competition =>
                                                <CompetitionTile competition={competition} key={competition.id}/>
                                            )
                                    }
                                </div>
                            </div> :
                            <EmptyMessage noun="competitions"/>
            }
        </>
    )
}
