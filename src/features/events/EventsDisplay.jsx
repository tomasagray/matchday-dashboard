import React, {useEffect} from "react";
import {useFetchAllEventsQuery} from "./eventApiSlice";
import {FillSpinner} from "../../components/Spinner";
import EventTile from "./EventTile";
import {ErrorMessage} from "../../components/ErrorMessage";
import {toast} from "react-toastify";
import {getToastMessage} from "../../app/utils";
import {EmptyMessage} from "../../components/EmptyMessage";

export const EventsDisplay = () => {

    const {
        data: events,
        isLoading,
        isSuccess,
        isError,
        error
    } = useFetchAllEventsQuery()

    useEffect(() => {
        if (isError) {
            let msg = 'Could not fetch latest events: ' + getToastMessage(error)
            toast.error(msg)
        }
    }, [error, isError])

    return (
        <>
            {
                isLoading ?
                    <FillSpinner/> :
                    isSuccess ?
                <div>
                    <h1>Latest Events</h1>
                    <div className={"Event-display"}>
                    {
                        events ?
                        Object.values(events.entities).map(event =>
                            <EventTile event={event} key={event['eventId']}/>
                        ) :
                        <EmptyMessage noun="events" />
                    }
                    </div>
                </div> :
                <ErrorMessage>No Events could be loaded from the server</ErrorMessage>
            }
        </>
    );
}
