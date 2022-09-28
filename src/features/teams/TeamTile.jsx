import {Link} from "react-router-dom";
import {SoftLoadImage} from "../../components/SoftLoadImage";

export default function TeamTile(props) {

    const placeholderUrl = process.env.PUBLIC_URL + '/img/default_team_emblem.png'
    let {team} = props
    let {id, name, _links: links} = team
    let imageUrl = links['emblem'].href


    return (
        <div className="Team-tile">
            <Link to={
                {
                    pathname: '/teams/team/' + id,
                }
            }>
                <SoftLoadImage
                    imageUrl={imageUrl}
                    placeholderUrl={placeholderUrl}
                    className="Entity-poster"
                />
                <div>{name?.name}</div>
            </Link>
        </div>
    );
};
