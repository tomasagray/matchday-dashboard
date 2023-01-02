import React, {useEffect, useState} from "react";
import {useFetchAllEventsQuery} from "../../slices/api/eventApiSlice";
import {EventsDisplay} from "./EventsDisplay";
import {useSelector} from "react-redux";
import {selectMatches} from "../../slices/matchSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {getToastMessage} from "../../utils";
import {toast} from "react-toastify";
import {useDetectElementBottom} from "../../hooks/useDetectElementBottom";

export const LatestEventsPage = (props) => {

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
    useDetectElementBottom(document.getElementById('Content-stage'), () => setNext(nextUrl))

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
