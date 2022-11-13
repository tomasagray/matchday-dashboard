import React, {useEffect} from "react";
import {useFetchAllCompetitionsQuery} from "./competitionApiSlice";
import {FillSpinner} from "../../components/Spinner";
import CompetitionTile from "./CompetitionTile";
import {toast} from "react-toastify";
import {getToastMessage} from "../../app/utils";
import {EmptyMessage} from "../../components/EmptyMessage";


export const CompetitionsDisplay = () => {

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
            {
                isLoading ?
                    <FillSpinner/> :
                    isSuccess && competitions ?
                    <div>
                        <h1>Competitions</h1>
                        <div className="Entity-display">
                            {
                                Object.values(competitions.entities).map(competition =>
                                    <CompetitionTile competition={competition} key={competition.id}/>
                                )
                            }
                        </div>
                    </div> :
                    <EmptyMessage noun="competitions" />
            }
        </>
    )
}
