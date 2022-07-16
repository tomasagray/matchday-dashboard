import {Link} from "react-router-dom";

export default function TeamTile(props) {

    let {team} = props
    let {name, _links: links} = team

    return (
        <div className={"Team-tile"}>
            <Link to={
                {
                    pathname: '/teams/team/' + props.team.id,
                    team: props.team,
                }
            }>
                <img src={links['emblem'].href} alt={name} className="Entity-poster"/>
                <div>{name}</div>
            </Link>
        </div>
    );
};
