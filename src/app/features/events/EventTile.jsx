import {formatDate} from "../../utils";
import {Link} from "react-router-dom";
import {SoftLoadImage} from "../../components/SoftLoadImage";

export default function EventTile(props) {

    const placeholderUrl = process.env.PUBLIC_URL + '/img/default_event_poster.png'

    const {event} = props
    let {eventId, title, competition, homeTeam, awayTeam, date, _links: links} = event
    let imageUrl = links['artwork'].href

    const details = homeTeam ?
        <>
            <span>{homeTeam.name?.name}</span> vs. <span>{awayTeam.name?.name}</span>
        </> :
        <span>{title}</span>

    return (
        <Link to={{pathname: '/events/event/' + eventId}}>
            <div className="Event-tile">
                <SoftLoadImage
                    placeholderUrl={placeholderUrl}
                    imageUrl={imageUrl}
                    className="Event-poster"
                />
                <div className="Event-details">
                    <p className={"Event-title"}>
                        <strong style={{marginRight: '.12em'}}>{competition.name?.name}</strong>
                        <span className={"Event-title-details"}>:&nbsp;{details}</span>
                    </p>
                    <div className="Event-date">{formatDate(date)}</div>
                </div>
            </div>
        </Link>
    )
}
