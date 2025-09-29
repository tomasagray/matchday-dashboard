import React from "react";
import EventTile from "./EventTile";
import {EmptyMessage} from "../../components/EmptyMessage";
import {setBackgroundImage} from "../../utils";


export const EventsDisplay = (props) => {

    // state
    let {events} = props

    // components
    setBackgroundImage('none')
    return (
        <div className={"Event-display"}>
            {
                events && Object.keys(events.entities).length > 0 ?
                    Object.values(events.entities)
                        .sort((e1, e2) => e2.date.localeCompare(e1.date))
                        .map(event => <EventTile event={event} key={event['eventId']}/>) :
                    <EmptyMessage noun="events"/>
            }
        </div>
    )
}
