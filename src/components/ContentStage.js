import {Route, Switch, useLocation} from "react-router-dom";
import React from "react";

import Home from "./Home";
import Events from "./Events";
import Competitions from "./Competitions";
import Teams from "./Teams";
import Settings from "./Settings";
import Alerts from "./Alerts";
import Search from "./Search";
import CompetitionDetail from "./CompetitionDetail";
import TeamDetail from "./TeamDetail";

export default function ContentStage() {
    let location = useLocation();
    // let transition = 'fade';

    return (
        <div id="Content-stage">
            <div className="Full-page-display">
                <Switch location={location}>
                    {/* Top level */} <Route exact path="/" component={Home}/> <Route path="/events"
                                                                                      component={Events}/> <Route
                    path="/competitions" component={Competitions}/> <Route path="/teams" component={Teams}/> <Route
                    path="/settings" component={Settings}/> <Route path="/alerts" component={Alerts}/> <Route
                    path="/search" component={Search}/> {/* Second level */} <Route path="/competition/"
                                                                                    component={CompetitionDetail}/>
                    <Route path="/team/" component={TeamDetail}/> </Switch>
            </div>
        </div>
    )
}
