import React, {useEffect, useState} from "react";
import {useFetchAllEventsQuery} from "../../slices/api/eventApiSlice";
import {EventsDisplay} from "./EventsDisplay";
import {useSelector} from "react-redux";
import {selectMatches} from "../../slices/matchSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {getToastMessage} from "../../app/utils";
import {toast} from "react-toastify";
import {useDetectPageBottom} from "../../hooks/useDetectPageBottom";

export const LatestEventsPage = (props) => {

    // TODO: make it possible to pass in a starting URL via react-router-dom
    let {startingUrl} =  props
    let [next, setNext] = useState(startingUrl)
    const {
        data,
        isLoading,
        // isSuccess,
        isError,
        error
    } = useFetchAllEventsQuery(next)
    let nextUrl = data?.next
    let events = useSelector(state => selectMatches(state))
    // handle soft load of more events
    useDetectPageBottom(() => setNext(nextUrl))

    // toast messages
    useEffect(() => {
        if (isError) {
            let msg = 'Error loading Events: ' + getToastMessage(error)
            toast.error(msg)
        }
    }, [isError, error])

    // components
    return (
        <div>
            <EventsDisplay events={events} />
            { isLoading ? <CenteredSpinner /> : null}
        </div>
    )
}
