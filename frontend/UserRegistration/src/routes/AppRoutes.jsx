// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage/HomePage.jsx";
import EmployeeVerificationPage from "../pages/EmployeeVerificationPage/EmployeeVerificationPage.jsx";
import SampleCollectionTypePage from "../pages/SampleCollectionTypePage/SampleCollectionTypePage.jsx";
import OnsiteFormPage from "../pages/OnsiteFormPage/OnsiteFormPage.jsx";
import OffsiteFormPage from "../pages/OffsiteFormPage/OffsiteFormPage.jsx";
import HomeCollectionFormPage from "../pages/HomeCollectionFormPage/HomeCollectionFormPage.jsx";
import OnsiteReportsPage from "../pages/OnsiteReportsPage/OnsiteReportsPage.jsx";
import OffsiteReportsPage from "../pages/OffsiteReportsPage/OffsiteReportsPage.jsx";
import HomeReportsPage from "../pages/HomeReportsPage/HomeReportsPage.jsx";
import BookingsPage from "../pages/BookingsPage/BookingsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/home-page/:hr_id/:client_id" element={<HomePage />} />
      <Route
        path="/employee-verification"
        element={<EmployeeVerificationPage />}
      />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route
        path="/sample-collection-type"
        element={<SampleCollectionTypePage />}
      />
      <Route path="/onsite-form" element={<OnsiteFormPage />} />
      <Route path="/offsite-form" element={<OffsiteFormPage />} />
      <Route
        path="/home-collection-form"
        element={<HomeCollectionFormPage />}
      />
      <Route path="/onsite-reports" element={<OnsiteReportsPage />} />
      <Route path="/offsite-reports" element={<OffsiteReportsPage />} />
      <Route path="/homecollection-reports" element={<HomeReportsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
