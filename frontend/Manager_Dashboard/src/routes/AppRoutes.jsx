/* eslint-disable no-unused-vars */
import React from "react";
import { Routes, Route } from "react-router-dom";
import ManagerLogin from "../pages/ManagerLogin";
import ManagerDashboard from "../pages/ManagerDashboard";
import Overview from "../components/Options/Overview";
import HRManagement from "../components/Options/HRManagement";
import EmployeeOverview from "../components/Options/EmployeeOverview";
import CampManagement from "../components/Options/CampManagement";
import Reports from "../components/Options/Reports";
import CommunicationHub from "../components/Options/CommunicationHub";
import Settings from "../components/Options/Settings";
import AnalyticsReports from "../components/Options/AnalyticsReports";
import HelpAndSupport from "../components/Options/HelpSupport/HelpAndSupport";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ManagerLogin />} />
      <Route path="/manager-dashboard" element={<ManagerDashboard />}>
        <Route path="overview" element={<Overview />} />
        <Route path="hr-management" element={<HRManagement />} />
        <Route path="employee-overview" element={<EmployeeOverview />} />
        <Route path="camp-management" element={<CampManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="communication-hub" element={<CommunicationHub />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics-reports" element={<AnalyticsReports />} />
        <Route path="help-support" element={<HelpAndSupport />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
