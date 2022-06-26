import React from "react";
import {NavButton} from "./NavButton";


export const SideNav = () => {

    return (
        <nav className="Side-nav">
            <ul className="Side-nav-menu">
                <NavButton href={'/events'} icon={'/img/icon/events/events_64.png'} />
                <NavButton href={'/competitions'} icon={'/img/icon/competitions/competitions_64.png'} />
                <NavButton href={'/teams'} icon={'/img/icon/teams/teams_64.png'} />
                <NavButton href={'/data-sources'} icon={'/img/icon/data-sources/data-sources_64.png'} />
            </ul>
        </nav>
    )
}
