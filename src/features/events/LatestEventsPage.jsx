import React, {useEffect, useState} from "react";
import {useFetchAllEventsQuery} from "./eventApiSlice";
import {EventsDisplay} from "./EventsDisplay";
import {useSelector} from "react-redux";
import {selectMatches} from "./matchSlice";
import {CenteredSpinner} from "../../components/Spinner";
import {getToastMessage} from "../../app/utils";
import {toast} from "react-toastify";

export const LatestEventsPage = (props) => {

    // startingUrl
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
    useEffect(() => {
        const handlePageScroll = () => {
            let isAtBottom = contentStage.scrollTop + contentStage.clientHeight >= contentStage.scrollHeight
            if (isAtBottom && nextUrl) {
                setNext(nextUrl)
            }
        }
        const contentStage = document.getElementById('Content-stage')
        contentStage.addEventListener('scroll', handlePageScroll)
        return () => contentStage.removeEventListener('scroll', handlePageScroll)
    }, [nextUrl])

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
            <h1>Latest Events</h1>
            <EventsDisplay events={events} />
            { isLoading ? <CenteredSpinner /> : null}
        </div>
    )
}
