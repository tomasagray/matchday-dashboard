import {useParams} from "react-router-dom";
import {useFetchEventsForCompetitionInfiniteQuery} from "../../slices/api/eventApiSlice";
import {useFetchCompetitionByIdQuery} from "../../slices/api/competitionApiSlice";
import React, {useEffect} from "react";
import {toast} from "react-toastify";
import {getToastMessage} from "../../utils";
import {ErrorMessage} from "../../components/ErrorMessage";
import {FillSpinner} from "../../components/Spinner";
import {EventsDisplay} from "./EventsDisplay";


export const CompetitionEventsPage = () => {

    let params = useParams()
    let {competitionId} = params

    const {
        data: matches,
        isLoading: isMatchesLoading,
        isError: isMatchesError,
        error: matchesError,
        fetchNextPage: fetchMoreMatches,
    } = useFetchEventsForCompetitionInfiniteQuery(competitionId)

    const {
        data: competition,
        isLoading: isCompetitionLoading,
        isError: isCompetitionError,
        error: competitionError
    } = useFetchCompetitionByIdQuery(competitionId)

    // state
    let posterUrl = competition?._links['emblem'].href

    // toast messages
    useEffect(() => {
        if (isCompetitionError)
            toast.error('Error loading Competition data: ' + getToastMessage(competitionError))
        if (isMatchesError)
            toast.error('Error loading Events: ' + getToastMessage(matchesError))
    }, [isCompetitionError, competitionError, isMatchesError, matchesError])

    return (
        <div style={{height: '100%'}}>
            {
                isMatchesError ?
                    <ErrorMessage>Could not load events.</ErrorMessage> :
                    isMatchesLoading || isCompetitionLoading ?
                        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                            <FillSpinner/>
                        </div> :
                        <>
                            <div>
                                <div className={'Filtered-events-header'}>
                                    <div className={'Competition-events-poster'}
                                         style={{backgroundImage: `url(${posterUrl})`}}>
                                        &nbsp;
                                    </div>
                                    <div>
                                        <h1>{competition?.name.name}</h1>
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