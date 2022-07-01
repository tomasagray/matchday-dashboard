import React from "react";
import {UserTile} from "./UserTile";

export const UserList = (props) => {

    let {users} = props
    let userTiles = users.map(user => <UserTile userId={user.userId} key={user.userId} /> )

    return (
        <div className={"User-list"}>
            {userTiles}
        </div>
    )
}
