import UserMenu from "./UserMenu";
import {Link} from "react-router-dom";

export const HeaderNav = () => {
    let PLACEHOLDER_IMG = process.env.PUBLIC_URL + '/img/_tmp.png';  // todo: create Matchday logo, use

    return (
        <header className="App-header">
            <nav className="Main-nav">
                <div className="Home-wrapper">
                    <Link to="/">
                        <button className="Home-button Nav-link">
                            <img src={PLACEHOLDER_IMG} alt="Matchday Dashboard" className="Home-button-img"
                                 id="home-button"/>
                        </button>
                    </Link>
                    <div className="Search-tool">
                        <form>
                            <input type="text" id="q" name="q" maxLength={250}/>
                            <button type="submit">
                                <img src={process.env.PUBLIC_URL + '/img/icon/search/search_32.png'} alt={"Search"}/>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="Admin-nav-menu-wrapper">
                    <ul className="Admin-nav-menu">
                        <li>
                            <Link to="/settings">
                                <button className="Nav-link">
                                    <img src={process.env.PUBLIC_URL + '/img/icon/config/config_64.png'} alt="Config"/>
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/alerts">
                                <button className="Nav-link">
                                    <img src={process.env.PUBLIC_URL + '/img/icon/alerts/alerts_64.png'} alt="Alerts"/>
                                </button>
                            </Link>
                        </li>
                        <li>
                            <UserMenu/>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}
