import React from 'react'
import {SettingContainer} from "./SettingContainer";
import {Link} from "react-router-dom";

export const SettingsLink = ({title = '[setting_title]', location = ''}) => {

    const imgUrl = '/img/icon/link-arrow/link-arrow_64.png'

    return (
        <Link to={location}>
            <SettingContainer className={"Settings-link"}>
                <p>{title}</p>
                <img src={imgUrl} alt={title} className="link-arrow"/>
            </SettingContainer>
        </Link>
    )
}
