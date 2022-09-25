import {Link} from "react-router-dom";
import {useSoftLoadImage} from "../../hooks/useSoftLoadImage";

export default function CompetitionTile(props) {

    const {competition} = props
    const {id, name, _links: links} = competition
    const placeholderUrl = process.env.PUBLIC_URL + '/img/default_competition_emblem.png'
    let {
        data: competitionEmblem,
    } = useSoftLoadImage(placeholderUrl, links['emblem'].href)

    return (
        <div className="Competition-tile">
            <Link to={
                {
                    pathname: '/competitions/competition/' + id,
                }
            }>
                <img src={competitionEmblem} alt={name.name} className="Entity-poster"/>
                <div>{name.name}</div>
            </Link>
        </div>
    );
};
