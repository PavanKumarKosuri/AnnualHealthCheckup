/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  BsFillFileEarmarkPdfFill,
  BsFillFileEarmarkTextFill,
} from "react-icons/bs";
import { FaShareAlt } from "react-icons/fa";
import debounce from "lodash/debounce";
import "../../styles/styles.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    // Set dummy data
    setReports(dummyReports);
    setFilteredReports(dummyReports);
  }, []);

  const handleSearch = debounce((e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    filterReports(searchTerm);
  }, 500);

  const filterReports = (searchTerm) => {
    if (searchTerm) {
      const filtered = reports.filter((report) =>
        report.title.toLowerCase().includes(searchTerm)
      );
      setFilteredReports(filtered);
    } else {
      setFilteredReports(reports);
    }
  };

  const handleDownload = (reportId, reportUrl) => {
    // Logic to download the report
    // window.open(reportUrl, "_blank");
  };

  const handleShare = (reportId) => {
    // Logic to share the report (e.g., via email, SMS, WhatsApp)
    console.log(`Sharing report ID: ${reportId}`);
    // Open a modal for sharing options or trigger share logic here
  };

  const dummyReports = [
    {
      id: "RPT001",
      title: "CBC Test Report - Mumbai",
      date: "2024-08-01",
      status: "Completed",
      url: "/reports/cbc_test_report_mumbai_2023.pdf",
    },
    {
      id: "RPT002",
      title: "ESR Test Report - Delhi",
      date: "2024-08-05",
      status: "Completed",
      url: "/reports/esr_test_report_delhi_2023.pdf",
    },
    {
      id: "RPT003",
      title: "Glucose Fasting Report - Bengaluru",
      date: "2024-08-10",
      status: "In Progress",
      url: "/reports/glucose_fasting_report_bengaluru_2024.pdf",
    },
    {
      id: "RPT004",
      title: "Hba1c Test Report - Hyderabad",
      date: "2024-08-15",
      status: "Pending",
      url: "/reports/hba1c_test_report_hyderabad_2024.pdf",
    },
    {
      id: "RPT005",
      title: "Lipid Profile Report - Pune",
      date: "2024-08-20",
      status: "Completed",
      url: "/reports/lipid_profile_report_pune_2024.pdf",
    },
    {
      id: "RPT006",
      title: "Liver Function Test Report - Chennai",
      date: "2024-08-25",
      status: "In Progress",
      url: "/reports/liver_function_test_chennai_2024.pdf",
    },
    {
      id: "RPT007",
      title: "Kidney Function Test Report - Kolkata",
      date: "2024-08-30",
      status: "Completed",
      url: "/reports/kidney_function_test_kolkata_2023.pdf",
    },
    {
      id: "RPT008",
      title: "TFT Test Report - Ahmedabad",
      date: "2024-09-01",
      status: "Pending",
      url: "/reports/tft_test_report_ahmedabad_2024.pdf",
    },
    {
      id: "RPT009",
      title: "Vitamin D Test Report - Jaipur",
      date: "2024-09-05",
      status: "In Progress",
      url: "/reports/vitamin_d_test_report_jaipur_2024.pdf",
    },
    {
      id: "RPT010",
      title: "Vitamin B12 Test Report - Chandigarh",
      date: "2024-09-10",
      status: "Completed",
      url: "/reports/vitamin_b12_test_report_chandigarh_2023.pdf",
    },
    {
      id: "RPT011",
      title: "Urine Routine Report - Mumbai",
      date: "2024-09-15",
      status: "Completed",
      url: "/reports/urine_routine_report_mumbai_2023.pdf",
    },
  ];

  const renderReportRows = () => {
    if (filteredReports.length > 0) {
      return filteredReports.map((report) => (
        <tr key={report.id}>
          <td>{report.id}</td>
          <td>{report.title}</td>
          <td>{report.date}</td>
          <td>{report.status}</td>
          <td>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleDownload(report.id, report.url)}
            >
              <BsFillFileEarmarkPdfFill /> Download
            </button>
          </td>
          <td>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleShare(report.id)}
            >
              <FaShareAlt /> Share
            </button>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan="6">
            No reports found for the specified search criteria.
          </td>
        </tr>
      );
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Reports Management</h3>
      </div>

      <div className="actions mt-4 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="reports-table mt-4">
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Report Title</th>
                <th>Date</th>
                <th>Status</th>
                <th>Download</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>{renderReportRows()}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Reports;
