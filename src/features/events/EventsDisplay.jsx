import React from "react";
import {useFetchAllEventsQuery} from "./eventApiSlice";
import {FillSpinner} from "../../components/Spinner";
import EventTile from "./EventTile";

export const EventsDisplay = () => {

    const {data: events, isLoading} = useFetchAllEventsQuery()

    return (
        <>
            {
                isLoading ?
                    <FillSpinner/> :
                <div>
                    <h1>Latest Events</h1>
                    <div className={"Event-display"}>
                    {
                        Object.values(events.entities).map(event =>
                            <EventTile event={event} key={event['eventId']}/>
                        )
                    }
                    </div>
                </div>
            }
        </>
    )
}
