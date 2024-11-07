/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import api from "../../axiosConfig";
// import * as XLSX from "xlsx";
// import "../../styles/styles.css";

// const ReportManagement = () => {
//   const [reports, setReports] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchReports = async () => {
//     try {
//       const token = localStorage.getItem("auth-token");
//       const response = await api.get("/api/vendor/reports", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setReports(response.data);
//     } catch (error) {
//       console.error("Error fetching reports!", error);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const handleSearch = (e) => {
//     const searchTerm = e.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//   };

//   const handleDownload = () => {
//     const ws = XLSX.utils.json_to_sheet(reports);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Reports");
//     XLSX.writeFile(wb, "reports.xlsx");
//   };

//   const filteredReports = reports.filter((report) =>
//     Object.values(report).some((val) =>
//       String(val).toLowerCase().includes(searchTerm)
//     )
//   );

//   return (
//     <main className="main-container">
//       <div className="main-title">
//         <h3>Report Management</h3>
//       </div>
//       <div className="actions mt-4 d-flex justify-content-between">
//         <input
//           type="text"
//           className="form-control w-50"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//         <button className="btn btn-secondary" onClick={handleDownload}>
//           Download Excel
//         </button>
//       </div>
//       <div className="report-table">
//         <div className="table-responsive">
//           <table className="table table-hover table-striped table-sm mt-3">
//             <thead>
//               <tr>
//                 <th>Report ID</th>
//                 <th>Employee ID</th>
//                 <th>Status</th>
//                 <th>Date Generated</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredReports.length > 0 ? (
//                 filteredReports.map((report) => (
//                   <tr key={report.reportId}>
//                     <td>{report.reportId}</td>
//                     <td>{report.employeeId}</td>
//                     <td>{report.status}</td>
//                     <td>{report.dateGenerated}</td>
//                     <td>
//                       <button className="btn btn-outline-primary btn-sm">
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5">No reports found.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ReportManagement;

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../../styles/styles.css";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Dummy data array for reports
  const dummyReports = [
    {
      reportId: "RPT001",
      employeeId: "EMP001",
      status: "Completed",
      dateGenerated: "2024-08-20",
    },
    {
      reportId: "RPT002",
      employeeId: "EMP002",
      status: "Pending",
      dateGenerated: "2024-08-21",
    },
    {
      reportId: "RPT003",
      employeeId: "EMP003",
      status: "Completed",
      dateGenerated: "2024-08-22",
    },
    {
      reportId: "RPT004",
      employeeId: "EMP004",
      status: "In Process",
      dateGenerated: "2024-08-23",
    },
  ];

  // Simulating data fetch with dummy data
  useEffect(() => {
    setReports(dummyReports);
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(reports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    XLSX.writeFile(wb, "reports.xlsx");
  };

  const handleViewClick = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleShareReport = (report) => {
    // Simulate sharing the report via email/SMS/WhatsApp
    alert(
      `Report ${report.reportId} shared with Employee ID ${report.employeeId}`
    );
  };

  const filteredReports = reports.filter((report) =>
    Object.values(report).some((val) =>
      String(val).toLowerCase().includes(searchTerm)
    )
  );

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Report Management</h3>
      </div>
      <div className="actions mt-4 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="btn btn-secondary" onClick={handleDownload}>
          Download Excel
        </button>
      </div>
      <div className="report-table">
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm mt-3">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Employee ID</th>
                {/* <th>Status</th> */}
                <th>Date Generated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.reportId}>
                    <td>{report.reportId}</td>
                    <td>{report.employeeId}</td>
                    {/* <td>{report.status}</td> */}
                    <td>{report.dateGenerated}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleViewClick(report)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-outline-success btn-sm ms-2"
                        onClick={() => handleShareReport(report)}
                      >
                        Share
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>View Report: {selectedReport?.reportId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Employee ID:</strong> {selectedReport?.employeeId}
          </p>
          <p>
            <strong>Status:</strong> {selectedReport?.status}
          </p>
          <p>
            <strong>Date Generated:</strong> {selectedReport?.dateGenerated}
          </p>
          <p>
            Here you can display detailed information about the report or
            provide a link to download the report PDF.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default ReportManagement;
