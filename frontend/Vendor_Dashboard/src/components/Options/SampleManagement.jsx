/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import JSZip from "jszip";
import "../../styles/styles.css";

const SampleManagement = () => {
  const [samples, setSamples] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSample, setSelectedSample] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [testResults, setTestResults] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  // Dummy data array
  const dummyData = [
    {
      sampleId: "SMP001",
      employeeId: "EMP001",
      status: "Received",
      dateReceived: "2024-08-20",
    },
    {
      sampleId: "SMP002",
      employeeId: "EMP002",
      status: "In Process",
      dateReceived: "2024-08-21",
    },
    {
      sampleId: "SMP003",
      employeeId: "EMP003",
      status: "Completed",
      dateReceived: "2024-08-22",
    },
    {
      sampleId: "SMP004",
      employeeId: "EMP004",
      status: "Pending",
      dateReceived: "2024-08-23",
    },
  ];

  // Simulating data fetch with dummy data
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

  const handleProcessClick = (sample) => {
    setSelectedSample(sample);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSample(null);
    setTestResults("");
    setReportFile(null);
  };

  const handleSaveResults = () => {
    if (selectedSample) {
      const updatedSamples = samples.map((sample) =>
        sample.sampleId === selectedSample.sampleId
          ? {
              ...sample,
              status: "Completed",
              testResults,
            }
          : sample
      );
      setSamples(updatedSamples);
      handleCloseModal();
    }
  };

  const handleFileChange = (e) => {
    setReportFile(e.target.files[0]);
  };

  const handleZipFileChange = (e) => {
    setZipFile(e.target.files[0]);
  };

  const handleZipUpload = async () => {
    if (!zipFile) return;

    const zip = new JSZip();
    try {
      const content = await zip.loadAsync(zipFile);
      const updatedSamples = [...samples];

      content.forEach(async (relativePath, file) => {
        if (file.name.endsWith(".pdf")) {
          const employeeId = file.name.replace(".pdf", "");
          const pdfData = await file.async("blob");

          // Update the sample with the corresponding employee ID
          const sampleIndex = updatedSamples.findIndex(
            (sample) => sample.employeeId === employeeId
          );
          if (sampleIndex !== -1) {
            updatedSamples[sampleIndex].status = "Completed";
            updatedSamples[sampleIndex].reportFile = pdfData;
          }
        }
      });

      setSamples(updatedSamples);
      alert("ZIP file processed successfully!");
      setZipFile(null);
    } catch (error) {
      console.error("Error processing ZIP file:", error);
      alert("Failed to process ZIP file.");
    }
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
      </div>
      <div className="sample-table mt-4">
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm">
            <thead>
              <tr>
                <th>Sample ID</th>
                <th>Employee ID</th>
                <th>Status</th>
                <th>Date Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.length > 0 ? (
                filteredSamples.map((sample) => (
                  <tr key={sample.sampleId}>
                    <td>{sample.sampleId}</td>
                    <td>{sample.employeeId}</td>
                    <td>{sample.status}</td>
                    <td>{sample.dateReceived}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleProcessClick(sample)}
                        disabled={sample.status === "Completed"}
                      >
                        {sample.status === "Completed"
                          ? "Processed"
                          : "Process"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No samples found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Process Sample: {selectedSample?.sampleId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="testResults" className="form-label">
              Enter Test Results
            </label>
            <textarea
              id="testResults"
              className="form-control"
              rows="4"
              value={testResults}
              onChange={(e) => setTestResults(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="reportFile" className="form-label">
              Upload Report (PDF)
            </label>
            <input
              type="file"
              id="reportFile"
              className="form-control"
              onChange={handleFileChange}
              accept=".pdf"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveResults}>
            Save Results
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default SampleManagement;
