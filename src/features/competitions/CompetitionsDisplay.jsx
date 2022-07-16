import React from "react";
import {useFetchAllCompetitionsQuery} from "./competitionApiSlice";
import {FillSpinner} from "../../components/Spinner";
import CompetitionTile from "./CompetitionTile";


export const CompetitionsDisplay = () => {

    const {data: competitions, isLoading} = useFetchAllCompetitionsQuery()

    return (
        <>
            {
                isLoading ?
                    <FillSpinner/> :
                    <div>
                        <h1>Competitions</h1>
                        <div className="Entity-display">
                            {
                                Object.values(competitions.entities).map(competition =>
                                    <CompetitionTile competition={competition} key={competition.id}/>
                                )
                            }
                        </div>
                    </div>
            }
        </>
    )
}
