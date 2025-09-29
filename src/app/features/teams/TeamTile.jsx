import {Link} from "react-router-dom";
import {SoftLoadImage} from "../../components/SoftLoadImage";

export default function TeamTile(props) {

    const placeholderUrl = '/img/default_team_emblem.png'

    // handlers
    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault()
            onClick(team)
        }
    }

    // props
    let {team, onClick} = props
    let {id, name: teamName, _links: links} = team
    let imageUrl
    if (links) {
        imageUrl = new URL(links['emblem'].href)
        imageUrl.searchParams.set('hash', Math.random().toString())
    } else {
        imageUrl = placeholderUrl
    }

    // components
    let poster =
        <>
            <SoftLoadImage
                imageUrl={imageUrl.toString()}
                placeholderUrl={placeholderUrl}
                className="Entity-poster"
            />
            <div className="Limited-label">{teamName?.name}</div>
        </>
    return (
        <div className="Team-tile" onClick={handleClick}>
            {
                !onClick ?
                    <Link style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} to={
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
