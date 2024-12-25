import {Link} from "react-router-dom";
import {SoftLoadImage} from "../../components/SoftLoadImage";

export default function CompetitionTile(props) {

    const placeholderUrl = process.env.PUBLIC_URL + '/img/default_competition_poster.png'
    let {competition} = props
    let {id, name, _links: links} = competition
    let imageUrl = links['emblem'].href

    return (
        <div className="Competition-tile">
            <Link to={
                {
                    pathname: '/competitions/competition/' + id,
                }
            }>
                <SoftLoadImage
                    placeholderUrl={placeholderUrl}
                    imageUrl={imageUrl}
                    className="Entity-poster"
                />
                <div className="Limited-label">{name?.name}</div>
            </Link>
        </div>
    );
};
