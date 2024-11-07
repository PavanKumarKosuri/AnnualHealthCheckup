/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { BsPlus, BsPencil, BsTrash, BsPersonLinesFill } from "react-icons/bs";
import debounce from "lodash/debounce";
import "../../styles/styles.css";

const HRManagement = () => {
  const [hrs, setHRs] = useState([]);
  const [filteredHRs, setFilteredHRs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    location: "",
    department: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedHR, setSelectedHR] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  useEffect(() => {
    fetchHRs();
  }, []);

  // Dummy HR data with associated employees
  const dummyHRData = [
    {
      id: "HR001",
      name: "Amit Sharma",
      email: "amit.sharma@example.com",
      location: "Mumbai",
      department: "Human Resources",
      employees: [
        {
          id: "EMP001",
          name: "Rohan Gupta",
          email: "rohan.gupta@example.com",
          phoneNumber: "9876543210",
          location: "Mumbai",
        },
        {
          id: "EMP002",
          name: "Sakshi Mehta",
          email: "sakshi.mehta@example.com",
          phoneNumber: "9123456789",
          location: "Mumbai",
        },
      ],
    },
    {
      id: "HR002",
      name: "Neha Verma",
      email: "neha.verma@example.com",
      location: "Delhi",
      department: "Recruitment",
      employees: [
        {
          id: "EMP003",
          name: "Rajesh Kumar",
          email: "rajesh.kumar@example.com",
          phoneNumber: "9876543211",
          location: "Delhi",
        },
        {
          id: "EMP004",
          name: "Priya Singh",
          email: "priya.singh@example.com",
          phoneNumber: "9123456790",
          location: "Delhi",
        },
      ],
    },
    {
      id: "HR003",
      name: "Sanjay Rao",
      email: "sanjay.rao@example.com",
      location: "Bengaluru",
      department: "Employee Relations",
      employees: [
        {
          id: "EMP005",
          name: "Amit Patel",
          email: "amit.patel@example.com",
          phoneNumber: "9876543212",
          location: "Bengaluru",
        },
        {
          id: "EMP006",
          name: "Nisha Jain",
          email: "nisha.jain@example.com",
          phoneNumber: "9123456791",
          location: "Bengaluru",
        },
      ],
    },
    {
      id: "HR004",
      name: "Anjali Sen",
      email: "anjali.sen@example.com",
      location: "Pune",
      department: "Training & Development",
      employees: [
        {
          id: "EMP007",
          name: "Arjun Desai",
          email: "arjun.desai@example.com",
          phoneNumber: "9876543213",
          location: "Pune",
        },
        {
          id: "EMP008",
          name: "Divya Narayan",
          email: "divya.narayan@example.com",
          phoneNumber: "9123456792",
          location: "Pune",
        },
      ],
    },
    {
      id: "HR005",
      name: "Karan Singh",
      email: "karan.singh@example.com",
      location: "Hyderabad",
      department: "Employee Relations",
      employees: [
        {
          id: "EMP009",
          name: "Vikas Sharma",
          email: "vikas.sharma@example.com",
          phoneNumber: "9876543214",
          location: "Hyderabad",
        },
        {
          id: "EMP010",
          name: "Sneha Reddy",
          email: "sneha.reddy@example.com",
          phoneNumber: "9123456793",
          location: "Hyderabad",
        },
      ],
    },
  ];

  const fetchHRs = debounce(() => {
    // Simulating an API call
    setHRs(dummyHRData);
    setFilteredHRs(dummyHRData);
  }, 1000);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = hrs.filter((hr) =>
      Object.values(hr).some((val) =>
        String(val).toLowerCase().includes(searchTerm)
      )
    );
    setFilteredHRs(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = (hr) => {
    setFormData(hr);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this HR?")) {
      const updatedHRs = hrs.filter((hr) => hr.id !== id);
      setHRs(updatedHRs);
      setFilteredHRs(updatedHRs);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedHRs = isEditing
      ? hrs.map((hr) =>
          hr.id === formData.id ? { ...formData, employees: hr.employees } : hr
        )
      : [...hrs, { ...formData, employees: [] }];
    setHRs(updatedHRs);
    setFilteredHRs(updatedHRs);
    setFormData({
      id: "",
      name: "",
      email: "",
      location: "",
      department: "",
    });
    setIsEditing(false);
  };

  const handleViewEmployees = (hr) => {
    setSelectedHR(hr);
    setShowEmployeeModal(true);
  };

  const closeEmployeeModal = () => {
    setShowEmployeeModal(false);
    setTimeout(() => {
      document.querySelector(".modal-backdrop")?.remove();
      document.querySelector(".modal-backdrop")?.remove();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }, 200); // Delay to allow modal to close first
  };

  const handleAddHR = () => {
    // Reset the form data to empty values
    setFormData({
      id: "",
      name: "",
      email: "",
      location: "",
      department: "",
    });
    setIsEditing(false); // Set editing to false, indicating it's a new HR
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>HR Management</h3>
      </div>

      <div className="actions mt-4 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search HRs..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          className="btn btn-secondary"
          data-bs-toggle="modal"
          data-bs-target="#hrModal"
          onClick={handleAddHR}
        >
          <BsPlus /> Add HR
        </button>
      </div>

      <div className="hr-table mt-4">
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHRs.length > 0 ? (
                filteredHRs.map((hr) => (
                  <tr key={hr.id}>
                    <td>{hr.id}</td>
                    <td>
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleViewEmployees(hr)}
                        data-bs-toggle="modal"
                        data-bs-target="#employeeModal"
                      >
                        {hr.name}
                      </span>
                    </td>
                    <td>{hr.email}</td>
                    <td>{hr.location}</td>
                    <td>{hr.department}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(hr)}
                        data-bs-toggle="modal"
                        data-bs-target="#hrModal"
                      >
                        <BsPencil /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(hr.id)}
                      >
                        <BsTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No HRs found for the specified criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding/Editing HR */}
      <div
        className="modal fade"
        id="hrModal"
        tabIndex="-1"
        aria-labelledby="hrModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ color: "black" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="hrModalLabel">
                {isEditing ? "Edit HR" : "Add HR"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="department" className="form-label">
                    Department
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Save Changes" : "Add HR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for Viewing Employees under an HR */}
      <div
        className={`modal fade ${showEmployeeModal ? "show" : ""}`}
        id="employeeModal"
        tabIndex="-1"
        aria-labelledby="employeeModalLabel"
        aria-hidden={!showEmployeeModal}
        style={{
          display: showEmployeeModal ? "block" : "none",
        }}
      >
        <div className="modal-dialog" style={{ color: "black" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="employeeModalLabel">
                Employees Managed by {selectedHR?.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeEmployeeModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedHR?.employees?.length > 0 ? (
                <ul className="list-group">
                  {selectedHR.employees.map((employee) => (
                    <li key={employee.id} className="list-group-item">
                      {employee.name} ({employee.location})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No employees found under this HR.</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeEmployeeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* {showEmployeeModal && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
        ></div>
      )} */}
    </main>
  );
};

export default HRManagement;
