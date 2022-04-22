import React, {Component} from "react";
import {Link} from "react-router-dom";

class SideNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItems: ['Events', 'Competitions', 'Teams', 'Datasources']  // defaults
        }
    }

    render() {
        return (
            <nav className="Side-nav">
                <ul className="Side-nav-menu">
                    <li>
                        <Link to="/events">
                            <button className="Data-section-link Nav-link">
                                <img src={process.env.PUBLIC_URL + '/img/event-icon.png'} alt="Events"/>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/competitions">
                            <button className="Data-section-link Nav-link">
                                <img src={process.env.PUBLIC_URL + '/img/competition-icon.png'} alt="Competitions"/>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/teams">
                            <button className="Data-section-link Nav-link">
                                <img src={process.env.PUBLIC_URL + '/img/team-icon.png'} alt="Teams"/>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/data-sources">
                            <button className="Data-section-link Nav-link">
                                <img src={process.env.PUBLIC_URL + '/img/datasource-icon.png'} alt="Datasources"/>
                            </button>
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }

}

export default SideNav;
