import {Link} from "react-router-dom";
import React, {useState} from "react";
import {FloatingMenu} from "../components/FloatingMenu";
import {MenuItem} from "../components/MenuItem";
import Modal, {Footer, Header} from "../components/Modal";
import {CancelButton} from "../components/controls/CancelButton";
import Cookies from "universal-cookie";
import {serverAddressCookie} from "../constants";

export const HeaderNav = () => {

    const LOGO = process.env.PUBLIC_URL + '/img/logo/logo_64.png'

    const setAdminMenuVisible = (e) => {
        e.preventDefault()
        setIsMenuHidden(false)
    }
    const setAdminMenuHidden = () => {
        setIsMenuHidden(true)
    }
    const onShowLogoutModal = () => {
        setAdminMenuHidden()
        setIsLogoutModalShown(true)
    }
    const onLogout = () => {
        cookies.remove(serverAddressCookie)
        setIsLogoutModalShown(false)
        window.location = '/login'
    }

    let cookies = new Cookies()
    let [isMenuHidden, setIsMenuHidden] = useState(true)
    let [isLogoutModalShown, setIsLogoutModalShown] = useState(false)

    return (
        <header className="App-header">
            <nav className="Main-nav">
                <div className="Home-wrapper">
                    <Link to="/">
                        <button className="Home-button Nav-link">
                            <img src={LOGO} alt="Matchday Dashboard" className="Home-button-img"
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
                                <MenuItem onClick={onShowLogoutModal}>
                                    Sign out
                                </MenuItem>
                            </FloatingMenu>
                        </li>
                    </ul>
                </div>
            </nav>
            <Modal show={isLogoutModalShown}>
                <Header onHide={() => setIsLogoutModalShown(false)}>
                    Sign out?
                </Header>
                <Footer>
                    <CancelButton onClick={() => setIsLogoutModalShown(false)}/>
                    <button className="Small-button" onClick={onLogout}>
                        Sign out
                    </button>
                </Footer>
            </Modal>
        </header>
    )
}
