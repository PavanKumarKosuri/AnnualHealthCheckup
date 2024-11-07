// vendor\src\routes\AppRoutes.jsx
/* eslint-disable no-unused-vars */
import React from "react";
import { Routes, Route } from "react-router-dom";
import VendorLogin from "../pages/VendorLogin";
import VendorDashboard from "../pages/VendorDashboard";
import Overview from "../components/Options/Overview/Overview";
import SampleManagement from "../components/Options/SampleManagement";
import ReportManagement from "../components/Options/ReportManagement";
import Communication from "../components/Options/Communication";
import Settings from "../components/Options/Settings";
import HelpAndSupport from "../components/Options/HelpSupport/HelpAndSupport";
import TestimonialManagement from "../components/Options/TestimonialManagement";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<VendorLogin />} />
      <Route path="/vendor-dashboard" element={<VendorDashboard />}>
        <Route path="overview" element={<Overview />} />
        <Route path="sample-management" element={<SampleManagement />} />
        <Route path="report-management" element={<ReportManagement />} />
        <Route
          path="testimonial-management"
          element={<TestimonialManagement />}
        />
        <Route path="communication" element={<Communication />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help-and-support" element={<HelpAndSupport />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
