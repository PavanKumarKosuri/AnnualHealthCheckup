/* eslint-disable no-unused-vars */
import React from "react";
import { Routes, Route } from "react-router-dom";
import HRLogin from "../pages/HRLogin";
import Dashboard from "../pages/Dashboard";
import Overview from "../components/Options/Overview";
import Settings from "../components/Options/Settings";
import Employees from "../components/Options/Employees";
import ReportsDownload from "../components/Options/ReportsDownload";
import CommunicationHub from "../components/Options/CommunicationHub";
import HelpSupport from "../components/Options/HelpSupport/HelpSupport";
import Registrations from "../components/Options/Registrations";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HRLogin />} />
      <Route path="/hr-dashboard" element={<Dashboard />}>
        <Route path="overview" element={<Overview />} />
        <Route path="settings" element={<Settings />} />
        <Route path="Registrations" element={<Registrations />} />
        <Route path="Employees" element={<Employees />} />
        <Route path="ReportsDownload" element={<ReportsDownload />} />
        <Route path="communication-hub" element={<CommunicationHub />} />
        <Route path="help-support" element={<HelpSupport />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
