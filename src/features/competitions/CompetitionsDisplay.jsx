import React, {useEffect} from "react";
import {useFetchAllCompetitionsQuery} from "./competitionApiSlice";
import {FillSpinner} from "../../components/Spinner";
import CompetitionTile from "./CompetitionTile";
import {toast} from "react-toastify";
import {ErrorMessage} from "../../components/ErrorMessage";
import {getToastMessage} from "../../app/utils";


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
    })

    return (
        <>
            {
                isLoading ?
                    <FillSpinner/> :
                    isSuccess ?
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
                    <ErrorMessage>Could not load Competitions</ErrorMessage>
            }
        </>
    )
}
