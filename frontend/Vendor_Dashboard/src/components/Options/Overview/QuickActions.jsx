/* eslint-disable no-unused-vars */
import React from "react";

const QuickActions = () => {
  const handleUploadReports = () => {
    alert("Uploading Reports...");
  };

  const handleGeneratePDFReports = () => {
    alert("Generating PDF Reports...");
  };

  const handleNotifyEmployees = () => {
    alert("Notifying Employees...");
  };

  return (
    <div className="quick-actions mt-5">
      <h4 style={{ color: "black" }}>Quick Actions</h4>
      <div className="d-flex justify-content-around mt-3">
        <button
          className="btn btn-outline-primary"
          onClick={handleUploadReports}
        >
          Upload Reports
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={handleGeneratePDFReports}
        >
          Generate PDF Reports
        </button>
        <button
          className="btn btn-outline-success"
          onClick={handleNotifyEmployees}
        >
          Notify Employees
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
