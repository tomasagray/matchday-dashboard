import {Outlet} from "react-router-dom";
import React from "react";

export const ContentStage = () => {
    // let transition = 'fade';

    return (
        <>
            <div id="Content-stage">
                <div className="Full-page-display">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}
