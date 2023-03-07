import {Link} from "react-router-dom";
import React, {useState} from "react";
import {FloatingMenu} from "../components/FloatingMenu";
import {MenuItem} from "../components/MenuItem";

export const HeaderNav = () => {

    let PLACEHOLDER_IMG = process.env.PUBLIC_URL + '/img/_tmp.png';  // todo: create Matchday logo, use

    const setAdminMenuVisible = (e) => {
        e.preventDefault()
        setIsMenuHidden(false)
    }
    const setAdminMenuHidden = () => {
        setIsMenuHidden(true)
    }

    let [isMenuHidden, setIsMenuHidden] = useState(true)

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
                            <Link to="/alerts">
                                <button className="Nav-link">
                                    <img src={process.env.PUBLIC_URL + '/img/icon/alerts/alerts_64.png'} alt="Alerts"/>
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button onClick={setAdminMenuVisible} className="Nav-link">
                                <img src={process.env.PUBLIC_URL + '/img/icon/avatar/avatar_64.png'} alt="User menu"/>
                            </button>
                            <FloatingMenu
                                className='User-menu-wrapper'
                                hidden={isMenuHidden}
                                onClickOutside={setAdminMenuHidden}>
                                <Link to="/settings">
                                    <MenuItem onClick={setAdminMenuHidden}>Settings</MenuItem>
                                </Link>
                                <Link to="/sanity-report">
                                    <MenuItem onClick={setAdminMenuHidden}>Sanity Report</MenuItem>
                                </Link>
                                <Link to="/backup">
                                    <MenuItem onClick={setAdminMenuHidden}>Backup</MenuItem>
                                </Link>
                                <Link to="/about">
                                    <MenuItem onClick={setAdminMenuHidden}>About</MenuItem>
                                </Link>
                                <MenuItem>Sign out</MenuItem>
                            </FloatingMenu>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}
