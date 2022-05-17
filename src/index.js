import React from 'react';
import './style/index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import store from "./app/store";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import {Home} from "./layout/Home";
import {Events} from "./features/events/Events";
import {Competitions} from "./features/competitions/Competitions";
import {Teams} from "./features/teams/Teams";
import {DataSourcePluginsList} from "./features/datasources/DataSourcePluginsList";
import {Settings} from "./layout/Settings";
import {Alerts} from "./components/Alerts";
import {Search} from "./layout/Search";
import {TeamDetail} from "./features/teams/TeamDetail";
import {CompetitionDetail} from "./features/competitions/CompetitionDetail";
import {PluginDataSourceList} from "./features/datasources/PluginDataSourceList";
import {createRoot} from "react-dom/client";

const container = document.getElementById('root');
const root = createRoot(container)
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <BrowserRouter>
              <Routes>
                <Route path="/" element={<App/>}>
                    {/* Top level */}
                    <Route exact path="/" element={<Home/>} />
                    <Route path="events" element={<Events/>} />
                    <Route path="competitions" element={<Competitions/>} />
                    <Route path="teams" element={<Teams/>} />
                    <Route path="data-sources" element={<DataSourcePluginsList/>} />
                    <Route path="settings" element={<Settings/>} />
                    <Route path="alerts" element={<Alerts/>} />
                    <Route path="search" element={<Search/>} />
                    {/* Second level */}
                    <Route path="competition" element={<CompetitionDetail/>} />
                    <Route path="team" element={<TeamDetail/>} />
                    <Route path="datasource/:pluginId" element={<PluginDataSourceList/>} />
                </Route>
              </Routes>
          </BrowserRouter>
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// todo - decide what to do with vitals
reportWebVitals();
