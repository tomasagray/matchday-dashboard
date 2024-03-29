import React from 'react';
import './app/style/index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import store from "./app/store";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./app/layout/Home";
import {CompetitionsDisplay} from "./app/features/competitions/CompetitionsDisplay";
import {TeamsDisplay} from "./app/features/teams/TeamsDisplay";
import {DataSourcePluginsList} from "./app/features/datasource-plugins/DataSourcePluginsList";
import {Settings} from "./app/features/admin/Settings";
import {Alerts} from "./app/components/Alerts";
import {Search} from "./app/layout/Search";
import {TeamDetails} from "./app/features/teams/TeamDetails";
import {CompetitionDetails} from "./app/features/competitions/CompetitionDetails";
import {PluginDataSourceList} from "./app/features/datasources/PluginDataSourceList";
import {createRoot} from "react-dom/client";
import {FileServerPluginList} from "./app/features/file-servers/FileServerPluginList";
import {FileServerUserList} from "./app/features/file-servers/FileServerUserList";
import {EventDetails} from "./app/features/events/EventDetails";
import {LatestEventsPage} from "./app/features/events/LatestEventsPage";
import {LoginPage} from "./app/features/login/LoginPage";
import {SanityReportDisplay} from "./app/features/admin/SanityReportDisplay";
import {Backup} from "./app/features/admin/Backup";
import {About} from "./app/features/admin/About";

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}>
                        <Route path="login" element={<LoginPage/>}/>
                        {/* Top bar nav */}
                        <Route path="search" element={<Search/>}/>
                        <Route path="alerts" element={<Alerts/>}/>
                        <Route path="settings" element={<Settings/>}/>
                        <Route path="sanity-report" element={<SanityReportDisplay/>}/>
                        <Route path="backup" element={<Backup/>}/>
                        <Route path="about" element={<About/>}/>
                        {/* Main nav - top level */}
                        <Route exact path="/" element={<Home/>}/>
                        <Route path="events" element={<LatestEventsPage/>}/>
                        <Route path="competitions" element={<CompetitionsDisplay/>}/>
                        <Route path="teams" element={<TeamsDisplay/>}/>
                        <Route path="data-sources" element={<DataSourcePluginsList/>}/>
                        <Route path="file-servers" element={<FileServerPluginList/>}/>
                        {/* Main nav - second level */}
                        <Route path="events/event/:eventId" element={<EventDetails/>}/>
                        <Route path="competitions/competition/:competitionId" element={<CompetitionDetails/>}/>
                        <Route path="teams/team/:teamId" element={<TeamDetails/>}/>
                        <Route path="data-sources/data-source/:pluginId" element={<PluginDataSourceList/>}/>
                        <Route path="file-servers/:pluginId/users" element={<FileServerUserList/>}/>
                </Route>
              </Routes>
          </BrowserRouter>
      </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// todo - decide what to do with vitals
reportWebVitals()
