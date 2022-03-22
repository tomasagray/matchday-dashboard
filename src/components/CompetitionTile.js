import {Link} from "react-router-dom";

export default function CompetitionTile(props) {
    // todo - implement soft load, change to poster link
    let posterUrl = props.competition._links.emblem.href;

    return (
        <>
            <Link to={
                {
                    pathname: '/competition/' + props.competition.id,
                    competition: props.competition,
                }
            }> <img src={posterUrl} alt={props.competition.name} className="Item-poster Competition-poster"/>
                <div className="Slide-content">
                    <div>{props.competition.name}</div>
                </div>
            </Link>
        </>
    );
};
