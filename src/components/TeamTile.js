import {Link} from "react-router-dom";

export default function TeamTile(props) {
    let emblemUrl = props.team._links.emblem.href;
    return (
        <>
            <Link to={
                {
                    pathname: '/team/' + props.team.id,
                    team: props.team,
                }
            }> <img src={emblemUrl} alt={props.team.name} className="Item-poster"/>
                <div className="Slide-content">
                    <div>{props.team.name}</div>
                </div>
            </Link>
        </>
    );
};
