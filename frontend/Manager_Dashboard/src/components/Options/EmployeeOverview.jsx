// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import api from "../../axiosConfig";
// import {
//   BsPeopleFill,
//   BsSearch,
//   BsEnvelope,
//   BsFillArchiveFill,
// } from "react-icons/bs";
// import debounce from "lodash/debounce";
// import "../../styles/styles.css";

// const EmployeeOverview = () => {
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedEmployees, setSelectedEmployees] = useState([]);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = debounce(async () => {
//     try {
//       const token = localStorage.getItem("auth-token");
//       const response = await api.get("/api/manager/employees", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setEmployees(response.data);
//       setFilteredEmployees(response.data);
//     } catch (error) {
//       console.error("Error fetching employees!", error);
//     }
//   }, 1000);

//   const handleSearch = (e) => {
//     const searchTerm = e.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     const filtered = employees.filter((employee) =>
//       Object.values(employee).some((val) =>
//         String(val).toLowerCase().includes(searchTerm)
//       )
//     );
//     setFilteredEmployees(filtered);
//   };

//   const handleSelectEmployee = (employeeId) => {
//     if (selectedEmployees.includes(employeeId)) {
//       setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
//     } else {
//       setSelectedEmployees([...selectedEmployees, employeeId]);
//     }
//   };

//   const handleBulkAction = (actionType) => {
//     if (selectedEmployees.length === 0) {
//       alert("Please select at least one employee.");
//       return;
//     }
//     // Implement the bulk action based on the actionType
//     console.log(`Performing ${actionType} on employees:`, selectedEmployees);
//     // Reset selection after the action
//     setSelectedEmployees([]);
//   };

//   const renderTableHeaders = () => (
//     <tr>
//       <th>
//         <input
//           type="checkbox"
//           onChange={(e) => {
//             if (e.target.checked) {
//               setSelectedEmployees(filteredEmployees.map((e) => e.id));
//             } else {
//               setSelectedEmployees([]);
//             }
//           }}
//           checked={
//             selectedEmployees.length > 0 &&
//             selectedEmployees.length === filteredEmployees.length
//           }
//         />
//       </th>
//       <th>ID</th>
//       <th>Employee ID</th>
//       <th>Name</th>
//       <th>Email</th>
//       <th>Phone Number</th>
//       <th>Location</th>
//       <th>HR Manager</th>
//       <th>Package</th>
//       <th>Status</th>
//       <th>Actions</th>
//     </tr>
//   );

//   const renderTableRows = () => {
//     if (filteredEmployees.length > 0) {
//       return filteredEmployees.map((employee) => (
//         <tr key={employee.id}>
//           <td>
//             <input
//               type="checkbox"
//               checked={selectedEmployees.includes(employee.id)}
//               onChange={() => handleSelectEmployee(employee.id)}
//             />
//           </td>
//           <td>{employee.id}</td>
//           <td>{employee.employeeId}</td>
//           <td>{employee.name}</td>
//           <td>{employee.email}</td>
//           <td>{employee.phoneNumber}</td>
//           <td>{employee.location}</td>
//           <td>{employee.hrManager}</td>
//           <td>{employee.package}</td>
//           <td>{employee.status}</td>
//           <td>
//             <button
//               className="btn btn-sm btn-primary"
//               onClick={() => console.log("Edit employee", employee.id)}
//             >
//               Edit
//             </button>
//           </td>
//         </tr>
//       ));
//     } else {
//       return (
//         <tr>
//           <td colSpan="11" className="text-center">
//             No employees found for the specified criteria.
//           </td>
//         </tr>
//       );
//     }
//   };

//   return (
//     <main className="main-container">
//       <div className="main-title">
//         <h3>Employee Overview</h3>
//       </div>

//       <div className="actions mt-4 d-flex justify-content-between">
//         <div className="search-bar w-50">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search employees..."
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//           <BsSearch className="search-icon" />
//         </div>

//         <div className="bulk-actions d-flex">
//           <button
//             className="btn btn-secondary me-2"
//             onClick={() => handleBulkAction("send-reminder")}
//           >
//             <BsEnvelope /> Send Reminder
//           </button>
//           <button
//             className="btn btn-secondary"
//             onClick={() => handleBulkAction("update-status")}
//           >
//             <BsFillArchiveFill /> Update Status
//           </button>
//         </div>
//       </div>

//       <div className="employee-table mt-4">
//         <div className="table-responsive">
//           <table className="table table-hover table-striped table-sm mt-3">
//             <thead>{renderTableHeaders()}</thead>
//             <tbody>{renderTableRows()}</tbody>
//           </table>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default EmployeeOverview;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  BsPeopleFill,
  BsSearch,
  BsEnvelope,
  BsFillArchiveFill,
  BsPencilSquare,
} from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import debounce from "lodash/debounce";
import "../../styles/styles.css";

const EmployeeOverview = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // Dummy data array
  const dummyEmployees = [
    {
      id: "1",
      employeeId: "EMP001",
      name: "Rohan Gupta",
      email: "rohan.gupta@example.com",
      phoneNumber: "9876543210",
      location: "Mumbai",
      hrManager: "Amit Sharma",
      package: "Package 1",
      status: "active",
    },
    {
      id: "2",
      employeeId: "EMP002",
      name: "Sakshi Mehta",
      email: "sakshi.mehta@example.com",
      phoneNumber: "9876543211",
      location: "Delhi",
      hrManager: "Neha Verma",
      package: "Package 2",
      status: "inactive",
    },
    {
      id: "3",
      employeeId: "EMP003",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phoneNumber: "9876543212",
      location: "Bengaluru",
      hrManager: "Amit Sharma",
      package: "Package 3",
      status: "active",
    },
    {
      id: "4",
      employeeId: "EMP004",
      name: "Priya Singh",
      email: "priya.singh@example.com",
      phoneNumber: "9876543213",
      location: "Chennai",
      hrManager: "Neha Verma",
      package: "Package 1",
      status: "active",
    },
    {
      id: "5",
      employeeId: "EMP005",
      name: "Amit Patel",
      email: "amit.patel@example.com",
      phoneNumber: "9876543214",
      location: "Hyderabad",
      hrManager: "Sanjay Rao",
      package: "Package 2",
      status: "inactive",
    },
    {
      id: "6",
      employeeId: "EMP006",
      name: "Nisha Jain",
      email: "nisha.jain@example.com",
      phoneNumber: "9876543215",
      location: "Pune",
      hrManager: "Amit Sharma",
      package: "Package 3",
      status: "active",
    },
    {
      id: "7",
      employeeId: "EMP007",
      name: "Arjun Desai",
      email: "arjun.desai@example.com",
      phoneNumber: "9876543216",
      location: "Kolkata",
      hrManager: "Sanjay Rao",
      package: "Package 1",
      status: "active",
    },
    {
      id: "8",
      employeeId: "EMP008",
      name: "Divya Narayan",
      email: "divya.narayan@example.com",
      phoneNumber: "9876543217",
      location: "Ahmedabad",
      hrManager: "Neha Verma",
      package: "Package 2",
      status: "inactive",
    },
    {
      id: "9",
      employeeId: "EMP009",
      name: "Vikas Sharma",
      email: "vikas.sharma@example.com",
      phoneNumber: "9876543218",
      location: "Gurgaon",
      hrManager: "Amit Sharma",
      package: "Package 3",
      status: "active",
    },
    {
      id: "10",
      employeeId: "EMP010",
      name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
      phoneNumber: "9876543219",
      location: "Jaipur",
      hrManager: "Sanjay Rao",
      package: "Package 1",
      status: "active",
    },
    {
      id: "11",
      employeeId: "EMP011",
      name: "Ravi Prakash",
      email: "ravi.prakash@example.com",
      phoneNumber: "9876543220",
      location: "Lucknow",
      hrManager: "Neha Verma",
      package: "Package 2",
      status: "inactive",
    },
    {
      id: "12",
      employeeId: "EMP012",
      name: "Anjali Sen",
      email: "anjali.sen@example.com",
      phoneNumber: "9876543221",
      location: "Chandigarh",
      hrManager: "Amit Sharma",
      package: "Package 3",
      status: "active",
    },
    {
      id: "13",
      employeeId: "EMP013",
      name: "Karan Singh",
      email: "karan.singh@example.com",
      phoneNumber: "9876543222",
      location: "Bhopal",
      hrManager: "Sanjay Rao",
      package: "Package 1",
      status: "active",
    },
    {
      id: "14",
      employeeId: "EMP014",
      name: "Maya Iyer",
      email: "maya.iyer@example.com",
      phoneNumber: "9876543223",
      location: "Kochi",
      hrManager: "Neha Verma",
      package: "Package 2",
      status: "inactive",
    },
    {
      id: "15",
      employeeId: "EMP015",
      name: "Suresh Pillai",
      email: "suresh.pillai@example.com",
      phoneNumber: "9876543224",
      location: "Thiruvananthapuram",
      hrManager: "Amit Sharma",
      package: "Package 3",
      status: "active",
    },
    {
      id: "16",
      employeeId: "EMP016",
      name: "Ritika Bhatt",
      email: "ritika.bhatt@example.com",
      phoneNumber: "9876543225",
      location: "Indore",
      hrManager: "Sanjay Rao",
      package: "Package 1",
      status: "active",
    },
    {
      id: "17",
      employeeId: "EMP017",
      name: "Yash Mehra",
      email: "yash.mehra@example.com",
      phoneNumber: "9876543226",
      location: "Vadodara",
      hrManager: "Neha Verma",
      package: "Package 2",
      status: "inactive",
    },
    {
      id: "18",
      employeeId: "EMP018",
      name: "Pooja Kapoor",
      email: "pooja.kapoor@example.com",
      phoneNumber: "9876543227",
      location: "Nagpur",
      hrManager: "Amit Sharma",
      package: "Package 3",
      status: "active",
    },
    {
      id: "19",
      employeeId: "EMP019",
      name: "Anurag Mishra",
      email: "anurag.mishra@example.com",
      phoneNumber: "9876543228",
      location: "Patna",
      hrManager: "Sanjay Rao",
      package: "Package 1",
      status: "active",
    },
    {
      id: "20",
      employeeId: "EMP020",
      name: "Nidhi Chauhan",
      email: "nidhi.chauhan@example.com",
      phoneNumber: "9876543229",
      location: "Surat",
      hrManager: "Neha Verma",
      package: "Package 2",
      status: "inactive",
    },
  ];

  useEffect(() => {
    setEmployees(dummyEmployees);
    setFilteredEmployees(dummyEmployees);
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = employees.filter((employee) =>
      Object.values(employee).some((val) =>
        String(val).toLowerCase().includes(searchTerm)
      )
    );
    setFilteredEmployees(filtered);
  };

  const handleSelectEmployee = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleBulkAction = (actionType) => {
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee.");
      return;
    }

    if (actionType === "send-reminder") {
      setShowReminderModal(true);
    } else if (actionType === "update-status") {
      setShowStatusModal(true);
    }

    // Reset selection after the action
    setSelectedEmployees([]);
  };

  const handleStatusChange = () => {
    const updatedEmployees = employees.map((employee) =>
      selectedEmployees.includes(employee.id)
        ? { ...employee, status: newStatus }
        : employee
    );
    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);
    setShowStatusModal(false);
  };

  const renderTableHeaders = () => (
    <tr>
      <th>
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedEmployees(filteredEmployees.map((e) => e.id));
            } else {
              setSelectedEmployees([]);
            }
          }}
          checked={
            selectedEmployees.length > 0 &&
            selectedEmployees.length === filteredEmployees.length
          }
        />
      </th>
      <th>ID</th>
      <th>Employee ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Phone Number</th>
      <th>Location</th>
      <th>HR Manager</th>
      <th>Package</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  );

  const renderTableRows = () => {
    if (filteredEmployees.length > 0) {
      return filteredEmployees.map((employee) => (
        <tr key={employee.id}>
          <td>
            <input
              type="checkbox"
              checked={selectedEmployees.includes(employee.id)}
              onChange={() => handleSelectEmployee(employee.id)}
            />
          </td>
          <td>{employee.id}</td>
          <td>{employee.employeeId}</td>
          <td>{employee.name}</td>
          <td>{employee.email}</td>
          <td>{employee.phoneNumber}</td>
          <td>{employee.location}</td>
          <td>{employee.hrManager}</td>
          <td>{employee.package}</td>
          <td>{employee.status}</td>
          <td>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => alert(`Editing employee: ${employee.id}`)}
            >
              Edit
            </button>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan="11" className="text-center">
            No employees found for the specified criteria.
          </td>
        </tr>
      );
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Employee Overview</h3>
      </div>

      <div className="actions mt-4 d-flex justify-content-between">
        <div className="search-bar w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <BsSearch className="search-icon" />
        </div>

        <div className="bulk-actions d-flex">
          <button
            className="btn btn-secondary me-2"
            onClick={() => handleBulkAction("send-reminder")}
          >
            <BsEnvelope /> Send Reminder
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleBulkAction("update-status")}
          >
            <BsFillArchiveFill /> Update Status
          </button>
        </div>
      </div>

      <div className="employee-table mt-4">
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm mt-3">
            <thead>{renderTableHeaders()}</thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>
      </div>

      {/* Reminder Modal */}
      <Modal
        show={showReminderModal}
        onHide={() => setShowReminderModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Dear [Employee Name],
            <br />
            This is a reminder to complete your test sample submission. Please
            ensure you are at the allocated time slot
            <br />
            Regards,
            <br />
            HR Department
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowReminderModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => alert("Reminder Sent!")}>
            Send Reminder
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="statusSelect" className="form-label">
            Select Status
          </label>
          <select
            id="statusSelect"
            className="form-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="closed">Closed</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleStatusChange}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default EmployeeOverview;
