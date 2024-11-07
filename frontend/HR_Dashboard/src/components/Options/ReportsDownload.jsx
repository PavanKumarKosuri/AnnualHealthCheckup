/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { FaWhatsapp, FaEnvelope, FaSms } from "react-icons/fa";
import api from "../../api/apiService";

const ReportsDownload = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/reports");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleShareClick = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleShare = (method) => {
    const reportUrl = `http://localhost:8080${selectedReport.url}`;
    const message = `Please find the report titled "${selectedReport.title}" at the following link: ${reportUrl}`;

    switch (method) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(message)}`,
          "_blank"
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(
            selectedReport.title
          )}&body=${encodeURIComponent(message)}`
        );
        break;
      case "sms":
        window.open(`sms:?body=${encodeURIComponent(message)}`);
        break;
      default:
        break;
    }

    handleModalClose();
  };

  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="main-title">Reports Download</h3>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Filter reports"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Report Title</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.length > 0 ? (
            filteredReports.map((report, index) => (
              <tr key={report.id}>
                <td>{index + 1}</td>
                <td>{report.title}</td>
                <td>{report.date}</td>
                <td>
                  <a
                    href={`http://localhost:8080${report.url}`}
                    className="btn btn-outline-dark btn-sm me-2"
                    download
                  >
                    Download
                  </a>
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
              <td colSpan="4" className="text-center">
                No reports found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Share Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>How would you like to share this report?</p>
          <div className="d-flex justify-content-around">
            <Button variant="success" onClick={() => handleShare("whatsapp")}>
              <FaWhatsapp className="me-2" /> WhatsApp
            </Button>
            <Button variant="info" onClick={() => handleShare("sms")}>
              <FaSms className="me-2" /> SMS
            </Button>
            <Button variant="primary" onClick={() => handleShare("email")}>
              <FaEnvelope className="me-2" /> Email
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReportsDownload;
