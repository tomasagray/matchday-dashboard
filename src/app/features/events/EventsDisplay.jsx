import React from "react";
import EventTile from "./EventTile";
import {EmptyMessage} from "../../components/EmptyMessage";
import {setBackgroundImage} from "../../utils";
import {useDetectElementBottom} from "../../hooks/useDetectElementBottom";


export const EventsDisplay = (props) => {

    const handlePageBottom = async () => pages?.next && fetchMore && await fetchMore()

    // hooks
    useDetectElementBottom(
        document.getElementById('Content-stage'),
        handlePageBottom
    )

    // state
    let {events, fetchMore} = props

    if (!events) return <p>No events.</p>

    let pages = events?.pages.reduce((prev, next) => {
        return {
            ids: [...prev.ids, ...next.ids],
            entities: {...prev.entities, ...next.entities},
            next: next.next,
        }
    })

    // components
    setBackgroundImage('none')
    return (
        <div className={"Event-display"}>
            {
                pages && Object.keys(pages.entities).length > 0 ?
                    Object.values(pages.entities)
                        .sort((e1, e2) => e2.date.localeCompare(e1.date))
                        .map(event => <EventTile event={event} key={event['eventId']}/>) :
                    <EmptyMessage noun="events"/>
            }
        </div>
    )
}
