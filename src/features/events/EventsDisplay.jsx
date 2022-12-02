import React from "react";
import EventTile from "./EventTile";
import {EmptyMessage} from "../../components/EmptyMessage";

export const EventsDisplay = (props) => {

    // state
    let {events} = props
    console.log('events', events)

    // components
    return (
        <>
            <div>
                <div className={"Event-display"}>
                {
                    events && events.entities.length > 0 ?
                        Object.values(events.entities).map(event =>
                            <EventTile event={event} key={event['eventId']}/>
                        ) :
                        <EmptyMessage noun="events" />
                }
                </div>
            </div>
        </>
    );
}
