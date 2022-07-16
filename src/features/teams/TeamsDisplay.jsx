import React from "react";
import {useFetchAllTeamsQuery} from "./teamApiSlice";
import {FillSpinner} from "../../components/Spinner";
import TeamTile from "./TeamTile";

export const TeamsDisplay = () => {

    const {data: teams, isLoading} = useFetchAllTeamsQuery()

    return (
        <>
            {
                isLoading ?
                    <FillSpinner /> :
                    <div>
                        <h1>Teams</h1>
                        <div className={"Entity-display"}>
                            {
                                Object.values(teams.entities).map(team =>
                                    <TeamTile team={team} key={team.id} />
                                )
                            }
                        </div>
                    </div>
            }
        </>
    )
}
