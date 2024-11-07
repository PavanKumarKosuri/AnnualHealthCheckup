// superAdmin/src/components/SuperAdmin/Options/SampleManagement.jsx
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import axios from "axios";

const SampleManagement = () => {
  const [samples, setSamples] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [zipFile, setZipFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [completedReports, setCompletedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Dummy data array
  const dummyData = [
    {
      employeeId: "EMP001",
      employeeName: "John Doe",
      city: "Mumbai",
      companyName: "XYZ Pvt Ltd",
      pdfFile: "/path/to/sample_report_1.pdf",
    },
    {
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      city: "Delhi",
      companyName: "ABC Corp",
      pdfFile: "/path/to/sample_report_2.pdf",
    },
    // Add more dummy data as needed
  ];

  useEffect(() => {
    setSamples(dummyData);
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(samples);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Samples");
    XLSX.writeFile(wb, "samples.xlsx");
  };

  const handleZipFileChange = (e) => {
    setZipFile(e.target.files[0]);
  };

  const handleZipUpload = async () => {
    if (!zipFile) return;

    const formData = new FormData();
    formData.append("zipFile", zipFile);

    try {
      const response = await axios.post("/api/process-zip", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.status === 200) {
        setCompletedReports(response.data.samples);
        setZipFile(null);
        setUploadProgress(0); // Reset progress
        setSamples(response.data.samples); // Update samples with new data
      } else {
        alert("Failed to process ZIP file.");
      }
    } catch (error) {
      console.error("Error processing ZIP file:", error);
      alert("Failed to process ZIP file.");
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleShareClick = (report) => {
    setSelectedReport(report);
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setSelectedReport(null);
  };

  const filteredSamples = samples.filter((sample) =>
    Object.values(sample).some((val) =>
      String(val).toLowerCase().includes(searchTerm)
    )
  );

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Sample Management</h3>
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
      <div className="upload-zip mt-4">
        <label
          htmlFor="zipFile"
          className="form-label"
          style={{ color: "black" }}
        >
          Upload ZIP file containing PDF reports
        </label>
        <input
          type="file"
          id="zipFile"
          className="form-control"
          onChange={handleZipFileChange}
          accept=".zip"
        />
        <button
          className="btn btn-primary mt-3"
          onClick={handleZipUpload}
          disabled={!zipFile}
        >
          Upload and Process ZIP
        </button>
        <ProgressBar
          animated
          now={uploadProgress}
          label={`${uploadProgress}%`}
          className="mt-3"
        />
      </div>

      {uploadProgress === 100 && (
        <div className="sample-table mt-4">
          <h4>Completed Reports</h4>
          <div className="table-responsive">
            <table className="table table-hover table-striped table-sm">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>City</th>
                  <th>Company Name</th>
                  <th>PDF Report</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {completedReports.length > 0 ? (
                  completedReports.map((report) => (
                    <tr key={report.employeeId}>
                      <td>{report.employeeName}</td>
                      <td>{report.employeeId}</td>
                      <td>{report.city}</td>
                      <td>{report.companyName}</td>
                      <td>
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() => handleViewReport(report)}
                        >
                          View PDF
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleShareClick(report)}
                        >
                          Share
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No reports processed yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Viewing PDF */}
      <Modal show={!!selectedReport} onHide={() => setSelectedReport(null)}>
        <Modal.Header closeButton>
          <Modal.Title>
            PDF Report for {selectedReport?.employeeName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <embed
            src={selectedReport?.pdfFile}
            type="application/pdf"
            width="100%"
            height="400px"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedReport(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Sharing Report */}
      <Modal show={shareModalOpen} onHide={handleCloseShareModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Share Report for {selectedReport?.employeeName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className="btn btn-outline-primary btn-block">
            Share via WhatsApp
          </Button>
          <Button className="btn btn-outline-success btn-block mt-2">
            Share via SMS
          </Button>
          <Button className="btn btn-outline-dark btn-block mt-2">
            Share via Email
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseShareModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default SampleManagement;
