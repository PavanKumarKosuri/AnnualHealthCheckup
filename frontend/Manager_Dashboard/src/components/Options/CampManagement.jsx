/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  BsFillCalendarFill,
  BsFillFileEarmarkPdfFill,
  BsFillPersonFill,
} from "react-icons/bs";
import "../../styles/styles.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const CampManagement = () => {
  const [camps, setCamps] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // fetchCamps();
    setCamps(dummyCamps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewDetails = (campId) => {
    const camp = camps.find((c) => c.id === campId);
    setSelectedCamp(camp);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCamp(null);
  };
  const dummyCamps = [
    {
      id: "CAMP001",
      name: "Health Camp Mumbai",
      location: "Mumbai",
      startDate: "2024-08-01",
      endDate: "2024-08-03",
      status: "Completed",
      assignedHrs: [
        { id: "HR001", name: "Amit Sharma", location: "Mumbai" },
        { id: "HR002", name: "Neha Verma", location: "Mumbai" },
      ],
      assignedEmployees: [
        { id: "EMP001", name: "Rohan Gupta", employeeId: "EMP001" },
        { id: "EMP002", name: "Sakshi Mehta", employeeId: "EMP002" },
      ],
    },
    {
      id: "CAMP002",
      name: "Health Camp Delhi",
      location: "Delhi",
      startDate: "2024-08-05",
      endDate: "2024-08-07",
      status: "In Progress",
      assignedHrs: [
        { id: "HR003", name: "Sanjay Rao", location: "Delhi" },
        { id: "HR004", name: "Anjali Sen", location: "Delhi" },
      ],
      assignedEmployees: [
        { id: "EMP003", name: "Rajesh Kumar", employeeId: "EMP003" },
        { id: "EMP004", name: "Priya Singh", employeeId: "EMP004" },
      ],
    },
    {
      id: "CAMP003",
      name: "Health Camp Bengaluru",
      location: "Bengaluru",
      startDate: "2024-08-10",
      endDate: "2024-08-12",
      status: "Scheduled",
      assignedHrs: [
        { id: "HR005", name: "Karan Singh", location: "Bengaluru" },
        { id: "HR006", name: "Anjali Desai", location: "Bengaluru" },
      ],
      assignedEmployees: [
        { id: "EMP005", name: "Amit Patel", employeeId: "EMP005" },
        { id: "EMP006", name: "Nisha Jain", employeeId: "EMP006" },
      ],
    },
    {
      id: "CAMP004",
      name: "Health Camp Hyderabad",
      location: "Hyderabad",
      startDate: "2024-08-15",
      endDate: "2024-08-17",
      status: "Scheduled",
      assignedHrs: [
        { id: "HR007", name: "Rahul Mehra", location: "Hyderabad" },
        { id: "HR008", name: "Sneha Reddy", location: "Hyderabad" },
      ],
      assignedEmployees: [
        { id: "EMP007", name: "Vikas Sharma", employeeId: "EMP007" },
        { id: "EMP008", name: "Sneha Reddy", employeeId: "EMP008" },
      ],
    },
    {
      id: "CAMP005",
      name: "Health Camp Pune",
      location: "Pune",
      startDate: "2024-08-20",
      endDate: "2024-08-22",
      status: "Scheduled",
      assignedHrs: [
        { id: "HR009", name: "Ankita Gupta", location: "Pune" },
        { id: "HR010", name: "Ravi Sharma", location: "Pune" },
      ],
      assignedEmployees: [
        { id: "EMP009", name: "Arjun Desai", employeeId: "EMP009" },
        { id: "EMP010", name: "Divya Narayan", employeeId: "EMP010" },
      ],
    },
    {
      id: "CAMP006",
      name: "Health Camp Chennai",
      location: "Chennai",
      startDate: "2024-08-25",
      endDate: "2024-08-27",
      status: "Scheduled",
      assignedHrs: [
        { id: "HR011", name: "Kavita Singh", location: "Chennai" },
        { id: "HR012", name: "Manoj Sharma", location: "Chennai" },
      ],
      assignedEmployees: [
        { id: "EMP011", name: "Kiran Patel", employeeId: "EMP011" },
        { id: "EMP012", name: "Anita Rao", employeeId: "EMP012" },
      ],
    },
    {
      id: "CAMP007",
      name: "Health Camp Kolkata",
      location: "Kolkata",
      startDate: "2024-08-30",
      endDate: "2024-09-01",
      status: "Scheduled",
      assignedHrs: [
        { id: "HR013", name: "Suman Sharma", location: "Kolkata" },
        { id: "HR014", name: "Prakash Mehta", location: "Kolkata" },
      ],
      assignedEmployees: [
        { id: "EMP013", name: "Anil Kumar", employeeId: "EMP013" },
        { id: "EMP014", name: "Pooja Singh", employeeId: "EMP014" },
      ],
    },
    {
      id: "CAMP008",
      name: "Health Camp Ahmedabad",
      location: "Ahmedabad",
      startDate: "2024-09-05",
      endDate: "2024-09-07",
      status: "Scheduled",
      assignedHrs: [
        { id: "HR015", name: "Meena Desai", location: "Ahmedabad" },
        { id: "HR016", name: "Rajesh Patel", location: "Ahmedabad" },
      ],
      assignedEmployees: [
        { id: "EMP015", name: "Vivek Shah", employeeId: "EMP015" },
        { id: "EMP016", name: "Kajal Mehta", employeeId: "EMP016" },
      ],
    },
    {
      id: "CAMP009",
      name: "Health Camp Jaipur",
      location: "Jaipur",
      startDate: "2024-09-10",
      endDate: "2024-09-12",
      status: "Scheduled",
      assignedHrs: [
        { id: "HR017", name: "Anupama Verma", location: "Jaipur" },
        { id: "HR018", name: "Rohit Singh", location: "Jaipur" },
      ],
      assignedEmployees: [
        { id: "EMP017", name: "Manoj Kumar", employeeId: "EMP017" },
        { id: "EMP018", name: "Aarti Sharma", employeeId: "EMP018" },
      ],
    },
    {
      id: "CAMP010",
      name: "Health Camp Chandigarh",
      location: "Chandigarh",
      startDate: "2024-09-15",
      endDate: "2024-09-17",
      status: "Scheduled",
      assignedHrs: [
        { id: "HR019", name: "Geeta Kapoor", location: "Chandigarh" },
        { id: "HR020", name: "Anil Kapoor", location: "Chandigarh" },
      ],
      assignedEmployees: [
        { id: "EMP019", name: "Deepak Sharma", employeeId: "EMP019" },
        { id: "EMP020", name: "Preeti Kaur", employeeId: "EMP020" },
      ],
    },
  ];
  const renderCampList = () => {
    return camps.map((camp) => (
      <tr key={camp.id}>
        <td>{camp.id}</td>
        <td>{camp.name}</td>
        <td>{camp.location}</td>
        <td>{camp.startDate}</td>
        <td>{camp.endDate}</td>
        <td>{camp.status}</td>
        <td>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleViewDetails(camp.id)}
          >
            View Details
          </button>
        </td>
      </tr>
    ));
  };

  const renderCampDetails = () => {
    if (!selectedCamp) return null;

    return (
      <>
        <Modal.Header closeButton style={{ color: "black" }}>
          <Modal.Title>Camp Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Name:</strong> {selectedCamp.name}
          </p>
          <p>
            <strong>Location:</strong> {selectedCamp.location}
          </p>
          <p>
            <strong>Start Date:</strong> {selectedCamp.startDate}
          </p>
          <p>
            <strong>End Date:</strong> {selectedCamp.endDate}
          </p>
          <p>
            <strong>Status:</strong> {selectedCamp.status}
          </p>
          <h5>Assigned HRs</h5>
          <ul>
            {selectedCamp.assignedHrs.map((hr) => (
              <li key={hr.id}>
                {hr.name} ({hr.location})
              </li>
            ))}
          </ul>
          <h5>Assigned Employees</h5>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <ul>
              {selectedCamp.assignedEmployees.map((emp) => (
                <li key={emp.id}>
                  {emp.name} ({emp.employeeId})
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </>
    );
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Camp Management</h3>
      </div>

      <div className="camp-table mt-4">
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>{renderCampList()}</tbody>
          </table>
        </div>
      </div>

      {/* Modal for Viewing Camp Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        {renderCampDetails()}
      </Modal>
    </main>
  );
};

export default CampManagement;
