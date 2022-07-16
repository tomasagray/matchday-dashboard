import {Link} from "react-router-dom";

export default function CompetitionTile(props) {

    const {competition} = props
    const {id, name, _links: links} = competition
    const posterUrl = links['emblem'].href

    return (
        <div className="Competition-tile">
            <Link to={
                {
                    pathname: '/competitions/competition/' + id,
                    competition: competition,
                }
            }>
                <img src={posterUrl} alt={name} className="Entity-poster"/>
                <div className="Competition-title">
                    {name}
                </div>
            </Link>
        </div>
    );
};
