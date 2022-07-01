import React from "react";
import {useSelector} from "react-redux";
import {selectUserById} from "./fileServerUserSlice";
import {Status, ToggleSwitch} from "../../components/ToggleSwitch";

export const UserTile = (props) => {

    let {userId} = props
    let user = useSelector(state => selectUserById(state, userId))
    console.log('user', user)
    let loggedIn = user.loggedIn ? Status().Checked : Status().Unchecked

    return (
        <div className={"User-tile"}>
            <div>
                <p><strong>{user.username}</strong></p>
                <p style={{color: '#aaa', fontSize: 'small'}}>
                    ID: <span style={{color: '#888'}}>{user.userId}</span>
                </p>
                <p style={{display: 'flex', alignItems: 'center'}}>
                    Logged In:
                    <ToggleSwitch status={loggedIn} size={'1rem'}/>
                </p>
            </div>
        </div>
    )
}
