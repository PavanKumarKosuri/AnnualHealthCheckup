// src/routes/AppRoutes.jsx

import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../components/SuperAdmin/Options/Dashboard.jsx";
import GetReports from "../components/SuperAdmin/Options/GetReports.jsx";
import Settings from "../components/SuperAdmin/Options/Settings.jsx";
import Registrations from "../components/SuperAdmin/Options/Registrations.jsx";
import SampleManagement from "../components/SuperAdmin/Options/SampleManagement.jsx";
import PackageSettings from "../components/SuperAdmin/Options/PackageSettings/PackageSettings.jsx";
import ClientList from "../components/SuperAdmin/Options/ClientManagement/ClientList.jsx";
import ClientForm from "../components/SuperAdmin/Options/ClientManagement/ClientForm.jsx";
import ClientDetails from "../components/SuperAdmin/Options/ClientManagement/ClientDetails.jsx";
import SuperAdminLayout from "../components/SuperAdmin/Layout/SuperAdminLayout.jsx";
import PhlebotomistSettings from "../components/SuperAdmin/Options/PhlebotomistSettings/PhlebotomistSettings.jsx";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = (loginStatus) => {
    setIsAdmin(loginStatus);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("accessToken");
  };

  return (
    <Routes>
      <Route path="/" element={<Login onAdminLogin={handleAdminLogin} />} />
      <Route
        path="/super-admin"
        element={
          isAdmin ? (
            <SuperAdminLayout onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="clients/add" element={<ClientForm />} />
        <Route path="clients/:id" element={<ClientDetails />} />
        <Route path="reports" element={<GetReports />} />
        <Route path="registrations" element={<Registrations />} />
        <Route path="samples" element={<SampleManagement />} />
        <Route path="package-settings" element={<PackageSettings />} />
        <Route
          path="phlebotomist-settings"
          element={<PhlebotomistSettings />}
        />
        <Route path="settings" element={<Settings />} />
        <Route
          path=""
          element={<Navigate to="/super-admin/dashboard" replace />}
        />
        <Route
          path="*"
          element={<Navigate to="/super-admin/dashboard" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
