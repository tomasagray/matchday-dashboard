import {Route, Switch, useLocation} from "react-router-dom";
import React from "react";

import Home from "./Home";
import Events from "../features/events/Events";
import Competitions from "../features/competitions/Competitions";
import Teams from "../features/teams/Teams";
import Datasources from "../features/datasources/Datasources";
import Settings from "./Settings";
import Alerts from "../components/Alerts";
import Search from "./Search";
import CompetitionDetail from "../features/competitions/CompetitionDetail";
import TeamDetail from "../features/teams/TeamDetail";

export default function ContentStage() {
    let location = useLocation();
    // let transition = 'fade';

    return (
        <div id="Content-stage">
            <div className="Full-page-display">
                <Switch location={location}>
                    {/* Top level */}
                    <Route exact path="/" component={Home}/>
                    <Route path="/events" component={Events}/>
                    <Route path="/competitions" component={Competitions}/>
                    <Route path="/teams" component={Teams}/>
                    <Route path="/datasources" component={Datasources}/>
                    <Route path="/settings" component={Settings}/>
                    <Route path="/alerts" component={Alerts}/>
                    <Route path="/search" component={Search}/>
                    {/* Second level */}
                    <Route path="/competition/" component={CompetitionDetail}/>
                    <Route path="/team/" component={TeamDetail}/>
                </Switch>
            </div>
        </div>
    )
}
