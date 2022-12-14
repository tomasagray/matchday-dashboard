import React from "react";

export const WizardMenuItem = (props) => {

    let {title, imgSrc, onClick, children, selected} = props
    let className = 'Wizard-menu-item'
    if (selected) {
        className += ' selected'
    }

    return (
        <li className={className} onClick={onClick}>
            {
                imgSrc ?
                    <img src={process.env.PUBLIC_URL + imgSrc} alt={title}/> :
                    null
            }
            <div>
                {children}
            </div>
        </li>
    );
}
