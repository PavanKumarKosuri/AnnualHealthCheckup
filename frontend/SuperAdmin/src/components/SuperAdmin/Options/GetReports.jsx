// superAdmin/src/components/SuperAdmin/Options/GetReports.jsx

import React, { useState } from "react";
import GetUsers from "./Reports/GetUsers";
import GetPhlebos from "./Reports/GetPhlebos";
import GetVendors from "./Reports/GetVendors";
import GetHrs from "./Reports/GetHrs";

const GetReports = () => {
  const [activeTab, setActiveTab] = useState("user");

  const renderTabContent = () => {
    switch (activeTab) {
      case "user":
        return <GetUsers />;
      case "phlebotomists":
        return <GetPhlebos />;
      case "vendors":
        return <GetVendors />;
      case "hr":
        return <GetHrs />;
      default:
        return <GetUsers />;
    }
  };

  return (
    <div className="container mt-3">
      <div className="main-title mb-3">
        <h3>RECORDS</h3>
      </div>
      <div className="d-flex flex-wrap mb-3">
        <button
          className={`btn ${
            activeTab === "user" ? "btn-secondary" : "btn-outline-dark"
          } mb-2 me-2`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`btn ${
            activeTab === "phlebotomists" ? "btn-secondary" : "btn-outline-dark"
          } mb-2 me-2`}
          onClick={() => setActiveTab("phlebotomists")}
        >
          Phlebotomists
        </button>
        <button
          className={`btn ${
            activeTab === "vendors" ? "btn-secondary" : "btn-outline-dark"
          } mb-2 me-2`}
          onClick={() => setActiveTab("vendors")}
        >
          Vendors
        </button>
        <button
          className={`btn ${
            activeTab === "hr" ? "btn-secondary" : "btn-outline-dark"
          } mb-2 me-2`}
          onClick={() => setActiveTab("hr")}
        >
          HRs
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default GetReports;
