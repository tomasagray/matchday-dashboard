import {Link} from "react-router-dom";
import {SoftLoadImage} from "../../components/SoftLoadImage";

export default function TeamTile(props) {

    // handlers
    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault()
            onClick(team)
        }
    }

    // props
    const placeholderUrl = process.env.PUBLIC_URL + '/img/default_team_emblem.png'
    let {team, onClick} = props
    let {id, name, _links: links} = team
    let imageUrl = links['emblem'].href

    // components
    let poster =
        <>
            <SoftLoadImage
                imageUrl={imageUrl}
                placeholderUrl={placeholderUrl}
                className="Entity-poster"
            />
            <div>{name?.name}</div>
        </>
    return (
        <div className="Team-tile" onClick={handleClick}>
            {
                !onClick ?
                    <Link to={
                        {
                            pathname: '/teams/team/' + id,
                        }
                    }>
                        {poster}
                    </Link> :
                    poster
            }
        </div>
    );
};
