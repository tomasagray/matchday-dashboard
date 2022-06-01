import React from 'react'
import {SettingContainer} from "./SettingContainer";
import {Link} from "react-router-dom";

export const SettingsLink = ({title = '[setting_title]', location = ''}) => {

    return (
        <Link to={location}>
            <SettingContainer className={"Settings-link"}>
                <p>{title}</p>
                <img src={process.env.PUBLIC_URL + '/img/link-arrow_64.png'} alt={title} className="link-arrow"/>
            </SettingContainer>
        </Link>
    )
}
