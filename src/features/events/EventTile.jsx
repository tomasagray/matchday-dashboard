import {formatDate} from "../../app/utils";
import {Link} from "react-router-dom";

export default function EventTile(props) {

    let imgUrl = process.env.PUBLIC_URL + '/img/_vs-poster.png' // todo - replace with better

    const {event} = props
    const {eventId, title, competition, homeTeam, awayTeam, date} = event
    const details = homeTeam ?
        <>
            <span>{homeTeam['name']}</span> vs. <span>{awayTeam['name']}</span>
        </> :
        <span>{title}</span>

    return (
        <Link to={{pathname: '/events/event/' + eventId}}>
            <div className="Event-tile">
                <img src={imgUrl} alt={props.event.title} className="Event-poster"/>
                <div className="Event-details">
                    <p className={"Event-title"}>
                        <strong>{competition['name']}</strong>
                        <span className={"Event-title-details"}>:&nbsp;{details}</span>
                    </p>
                    <div className="Event-date">{formatDate(date)}</div>
                </div>
            </div>
        </Link>
    )
}
