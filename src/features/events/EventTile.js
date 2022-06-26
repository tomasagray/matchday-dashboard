import {formatDate} from "../../Utils";
import {Link} from "react-router-dom";

export default function EventTile(props) {
    let imgUrl = process.env.PUBLIC_URL + '/img/_vs-poster.png';
    return (
        <>
            <Link to={
                {
                    pathname: '/event/' + props.event.eventId,
                    event: props.event,
                }
            }>
                <img src={imgUrl} alt={props.event.title} className="Event-poster"/>
                <div className="Slide-content">
                    <div className="Event-title">{props.event.title}</div>
                    <div className="Event-date">{formatDate(props.event.date)}</div>
                </div>
            </Link>
        </>
    );
};
