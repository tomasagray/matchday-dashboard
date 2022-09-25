import {Link} from "react-router-dom";

export default function TeamTile(props) {

    let {team} = props
    let {id, name, _links: links} = team

    return (
        <div className={"Team-tile"}>
            <Link to={
                {
                    pathname: '/teams/team/' + id,
                }
            }>
                <img src={links['emblem']} alt={name} className="Entity-poster"/>
                <div>{name}</div>
            </Link>
        </div>
    );
};
