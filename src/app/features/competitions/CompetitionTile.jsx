import {Link} from "react-router-dom";
import {SoftLoadImage} from "../../components/SoftLoadImage";

export default function CompetitionTile(props) {

    const placeholderUrl = '/img/default_competition_poster.png'
    let {competition} = props
    let {id, name, _links: links} = competition
    let imageUrl = new URL(links['emblem'].href)
    imageUrl.searchParams.set('hash', Math.random().toString())

    return (
        <div className="Competition-tile">
            <Link to={
                {
                    pathname: '/competitions/competition/' + id,
                }
            }>
                <SoftLoadImage
                    placeholderUrl={placeholderUrl}
                    imageUrl={imageUrl.toString()}
                    className="Entity-poster"
                />
                <div className="Limited-label">{name?.name}</div>
            </Link>
        </div>
    );
};
