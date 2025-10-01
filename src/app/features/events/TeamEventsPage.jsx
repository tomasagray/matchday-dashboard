import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useFetchMatchesForTeamInfiniteQuery} from "../../slices/api/eventApiSlice";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {ErrorMessage} from "../../components/ErrorMessage";
import {FillSpinner} from "../../components/Spinner";
import {EventsDisplay} from "./EventsDisplay";
import {useFetchTeamByIdQuery} from "../../slices/api/teamApiSlice";


export const TeamEventsPage = () => {

    let params = useParams()
    let {teamId} = params

    // hooks
    const {
        data: matches,
        isLoading: isMatchesLoading,
        isError: isMatchesError,
        error: matchesError,
        fetchNextPage: fetchMoreMatches,
    } = useFetchMatchesForTeamInfiniteQuery(teamId)

    const {
        data: team,
        isLoading: isTeamLoading,
        isError: isTeamError,
        error: teamError
    } = useFetchTeamByIdQuery(teamId)

    // toast messages
    useEffect(() => {
        if (isTeamError)
            toast.error('Error loading Team data: ' + getToastMessage(teamError))
        if (isMatchesError)
            toast.error('Error loading Events: ' + getToastMessage(matchesError))
    }, [isTeamError, teamError, isMatchesError, matchesError])

    // components
    return (
        <div style={{height: '100%'}}>
            {
                isMatchesError ?
                    <ErrorMessage>Could not load events.</ErrorMessage> :
                    isMatchesLoading || isTeamLoading ?
                        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                            <FillSpinner/>
                        </div> :
                        <>
                            <div>
                                <div className={'Filtered-events-header'}>
                                    <img src={team?._links['emblem'].href} alt={team?.name.name} width={'96px'}/>
                                    <div>
                                        <h1>{team?.name.name}</h1>
                                        <p>Latest events</p>
                                    </div>
                                </div>
                            </div>
                            <EventsDisplay events={matches} fetchMore={fetchMoreMatches}/>
                        </>
            }
        </div>
    )
}