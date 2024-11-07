// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from "react";
// import api from "../../axiosConfig";
// import {
//   BsFillArchiveFill,
//   BsFillGrid3X3GapFill,
//   BsPeopleFill,
//   BsFillBarChartFill,
//   BsFillAlarmFill,
// } from "react-icons/bs";
// import debounce from "lodash/debounce";
// import * as XLSX from "xlsx";
// import "../../styles/styles.css";

// const Overview = ({ city, companyName }) => {
//   const [dashboardData, setDashboardData] = useState({
//     totalHRs: 0,
//     totalEmployees: 0,
//     totalCamps: 0,
//     reportsGenerated: 0,
//     employees: [],
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [filterType, setFilterType] = useState("all");

//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem("auth-token");
//       const response = await api.get(`/api/manager/dashboard-metrics`, {
//         params: { city, companyName },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setDashboardData((prevData) => ({
//         ...prevData,
//         totalHRs: response.data.totalHRs,
//         totalEmployees: response.data.totalEmployees,
//         totalCamps: response.data.totalCamps,
//         reportsGenerated: response.data.reportsGenerated,
//       }));
//     } catch (error) {
//       console.error("There was an error fetching the dashboard data!", error);
//     }
//   };

//   const fetchEmployeesByLocation = debounce(async (filterType) => {
//     try {
//       const token = localStorage.getItem("auth-token");
//       const response = await api.get(`/api/manager/employees-by-location`, {
//         params: { city, companyName, filterType },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setDashboardData((prevData) => ({
//         ...prevData,
//         employees: response.data,
//       }));
//       filterEmployees(response.data, filterType, searchTerm);
//     } catch (error) {
//       console.error(
//         "There was an error fetching the employees by location!",
//         error
//       );
//     }
//   }, 1000);

//   useEffect(() => {
//     fetchDashboardData();
//     fetchEmployeesByLocation(filterType);
//   }, [city, companyName, filterType]);

//   const filterEmployees = (employees, filterType, searchTerm) => {
//     let filtered = employees;

//     if (filterType === "active") {
//       filtered = employees.filter((employee) => employee.status === "active");
//     } else if (filterType === "inactive") {
//       filtered = employees.filter((employee) => employee.status === "inactive");
//     }

//     if (searchTerm) {
//       filtered = filtered.filter((employee) =>
//         Object.values(employee).some((val) =>
//           String(val).toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }
//     setFilteredEmployees(filtered);
//   };

//   const handleSearch = (e) => {
//     const searchTerm = e.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     filterEmployees(dashboardData.employees, filterType, searchTerm);
//   };

//   const handleFilter = (newFilterType) => {
//     setFilterType(newFilterType);
//     fetchEmployeesByLocation(newFilterType);
//   };

//   const handleDownload = () => {
//     const ws = XLSX.utils.json_to_sheet(filteredEmployees);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Employees");
//     XLSX.writeFile(wb, "employees.xlsx");
//   };

//   const renderTableHeaders = () => (
//     <tr>
//       <th>ID</th>
//       <th>HR Manager</th>
//       <th>Location</th>
//       <th>Employee Name</th>
//       <th>Status</th>
//       <th>Package</th>
//       <th>Reports Generated</th>
//     </tr>
//   );

//   const renderTableRows = () => {
//     if (filteredEmployees.length > 0) {
//       return filteredEmployees.map((employee) => (
//         <tr key={employee.id}>
//           <td>{employee.id}</td>
//           <td>{employee.hrManager}</td>
//           <td>{employee.location}</td>
//           <td>{employee.employeeName}</td>
//           <td>{employee.status}</td>
//           <td>{employee.package}</td>
//           <td>{employee.reportsGenerated}</td>
//         </tr>
//       ));
//     } else {
//       return (
//         <tr>
//           <td colSpan="7">
//             No employees found for the specified filter and search criteria.
//           </td>
//         </tr>
//       );
//     }
//   };

//   return (
//     <main className="main-container">
//       <div className="main-title">
//         <h3>Manager Dashboard Overview</h3>
//       </div>
//       <div className="main-cards row">
//         <div className="col-12 col-sm-6 col-md-3 mb-3">
//           <div className="card" onClick={() => handleFilter("all")}>
//             <div className="card-inner">
//               <h4>Total HRs</h4>
//               <BsFillArchiveFill className="card_icon" />
//             </div>
//             <h1>{dashboardData.totalHRs}</h1>
//           </div>
//         </div>
//         <div className="col-12 col-sm-6 col-md-3 mb-3">
//           <div className="card" onClick={() => handleFilter("all")}>
//             <div className="card-inner">
//               <h4>Total Employees</h4>
//               <BsPeopleFill className="card_icon" />
//             </div>
//             <h1>{dashboardData.totalEmployees}</h1>
//           </div>
//         </div>
//         <div className="col-12 col-sm-6 col-md-3 mb-3">
//           <div className="card" onClick={() => handleFilter("all")}>
//             <div className="card-inner">
//               <h4>Total Camps</h4>
//               <BsFillGrid3X3GapFill className="card_icon" />
//             </div>
//             <h1>{dashboardData.totalCamps}</h1>
//           </div>
//         </div>
//         <div className="col-12 col-sm-6 col-md-3 mb-3">
//           <div className="card" onClick={() => handleFilter("all")}>
//             <div className="card-inner">
//               <h4>Reports Generated</h4>
//               <BsFillBarChartFill className="card_icon" />
//             </div>
//             <h1>{dashboardData.reportsGenerated}</h1>
//           </div>
//         </div>
//       </div>
//       <div className="alerts mt-4">
//         <h4>Alerts & Notifications</h4>
//         <ul>
//           <li>
//             <BsFillAlarmFill /> Upcoming camp in New York on 2024-08-25.
//           </li>
//           <li>
//             <BsFillAlarmFill /> 5 reports pending approval in California.
//           </li>
//           {/* Add more alerts as necessary */}
//         </ul>
//       </div>
//       <div className="actions mt-4 d-flex justify-content-between">
//         <input
//           type="text"
//           className="form-control w-50"
//           placeholder="Search employees..."
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//         <button className="btn btn-secondary" onClick={handleDownload}>
//           Download Excel
//         </button>
//       </div>

//       <div className="employee-table">
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

// export default Overview;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBarChartFill,
  BsFillAlarmFill,
} from "react-icons/bs";
import debounce from "lodash/debounce";
import * as XLSX from "xlsx";
import "../../styles/styles.css";

const Overview = ({ city, companyName }) => {
  const [dashboardData, setDashboardData] = useState({
    totalHRs: 0,
    totalEmployees: 0,
    totalCamps: 0,
    reportsGenerated: 0,
    employees: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filterType, setFilterType] = useState("all");

  // Dummy data for dashboard metrics
  const dummyDashboardData = {
    totalHRs: 5,
    totalEmployees: 120,
    totalCamps: 10,
    reportsGenerated: 95,
    employees: [
      {
        id: "EMP001",
        hrManager: "Amit Sharma",
        location: "Mumbai",
        employeeName: "Rohan Gupta",
        status: "active",
        package: "Package 1",
        reportGenerated: "Completed",
      },
      {
        id: "EMP002",
        hrManager: "Priya Singh",
        location: "Delhi",
        employeeName: "Anjali Mehta",
        status: "inactive",
        package: "Package 2",
        reportGenerated: "Pending",
      },
      {
        id: "EMP003",
        hrManager: "Amit Sharma",
        location: "Bengaluru",
        employeeName: "Vikram Patil",
        status: "active",
        package: "Package 3",
        reportGenerated: "Completed",
      },
      {
        id: "EMP004",
        hrManager: "Priya Singh",
        location: "Hyderabad",
        employeeName: "Neha Rao",
        status: "inactive",
        package: "Package 1",
        reportGenerated: "Pending",
      },
      {
        id: "EMP005",
        hrManager: "Sunita Iyer",
        location: "Chennai",
        employeeName: "Arjun Reddy",
        status: "active",
        package: "Package 2",
        reportGenerated: "Completed",
      },
      {
        id: "EMP006",
        hrManager: "Amit Sharma",
        location: "Pune",
        employeeName: "Sneha Kulkarni",
        status: "active",
        package: "Package 3",
        reportGenerated: "Completed",
      },
      {
        id: "EMP007",
        hrManager: "Priya Singh",
        location: "Kolkata",
        employeeName: "Rahul Sen",
        status: "inactive",
        package: "Package 1",
        reportGenerated: "Pending",
      },
      {
        id: "EMP008",
        hrManager: "Sunita Iyer",
        location: "Ahmedabad",
        employeeName: "Pooja Shah",
        status: "active",
        package: "Package 2",
        reportGenerated: "Completed",
      },
      {
        id: "EMP009",
        hrManager: "Amit Sharma",
        location: "Mumbai",
        employeeName: "Karan Desai",
        status: "active",
        package: "Package 3",
        reportGenerated: "Completed",
      },
      {
        id: "EMP010",
        hrManager: "Priya Singh",
        location: "Delhi",
        employeeName: "Ritika Bhatia",
        status: "inactive",
        package: "Package 1",
        reportGenerated: "Pending",
      },
      {
        id: "EMP011",
        hrManager: "Sunita Iyer",
        location: "Bengaluru",
        employeeName: "Ankit Jain",
        status: "active",
        package: "Package 2",
        reportGenerated: "Completed",
      },
      {
        id: "EMP012",
        hrManager: "Amit Sharma",
        location: "Hyderabad",
        employeeName: "Shruti Verma",
        status: "active",
        package: "Package 3",
        reportGenerated: "Completed",
      },
      {
        id: "EMP013",
        hrManager: "Priya Singh",
        location: "Chennai",
        employeeName: "Manish Kumar",
        status: "inactive",
        package: "Package 1",
        reportGenerated: "Pending",
      },
      {
        id: "EMP014",
        hrManager: "Sunita Iyer",
        location: "Pune",
        employeeName: "Divya Menon",
        status: "active",
        package: "Package 2",
        reportGenerated: "Completed",
      },
      {
        id: "EMP015",
        hrManager: "Amit Sharma",
        location: "Kolkata",
        employeeName: "Vivek Roy",
        status: "active",
        package: "Package 3",
        reportGenerated: "Completed",
      },
      {
        id: "EMP016",
        hrManager: "Priya Singh",
        location: "Ahmedabad",
        employeeName: "Rashmi Patel",
        status: "inactive",
        package: "Package 1",
        reportGenerated: "Pending",
      },
      {
        id: "EMP017",
        hrManager: "Sunita Iyer",
        location: "Mumbai",
        employeeName: "Siddharth Joshi",
        status: "active",
        package: "Package 2",
        reportGenerated: "Completed",
      },
      {
        id: "EMP018",
        hrManager: "Amit Sharma",
        location: "Delhi",
        employeeName: "Meera Nair",
        status: "active",
        package: "Package 3",
        reportGenerated: "Completed",
      },
      {
        id: "EMP019",
        hrManager: "Priya Singh",
        location: "Bengaluru",
        employeeName: "Ravi Shetty",
        status: "inactive",
        package: "Package 1",
        reportGenerated: "Pending",
      },
      {
        id: "EMP020",
        hrManager: "Sunita Iyer",
        location: "Hyderabad",
        employeeName: "Nisha Naidu",
        status: "active",
        package: "Package 2",
        reportGenerated: "Completed",
      },
    ],
  };

  useEffect(() => {
    // Simulate data fetch
    setDashboardData(dummyDashboardData);
    filterEmployees(dummyDashboardData.employees, filterType, searchTerm);
  }, [filterType]);

  const filterEmployees = (employees, filterType, searchTerm) => {
    let filtered = employees;

    if (filterType === "active") {
      filtered = employees.filter((employee) => employee.status === "active");
    } else if (filterType === "inactive") {
      filtered = employees.filter((employee) => employee.status === "inactive");
    }

    if (searchTerm) {
      filtered = filtered.filter((employee) =>
        Object.values(employee).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredEmployees(filtered);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    filterEmployees(dashboardData.employees, filterType, searchTerm);
  };

  const handleFilter = (newFilterType) => {
    setFilterType(newFilterType);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEmployees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "employees.xlsx");
  };

  const renderTableHeaders = () => (
    <tr>
      <th>ID</th>
      <th>HR Manager</th>
      <th>Location</th>
      <th>Employee Name</th>
      <th>Status</th>
      <th>Package</th>
      <th>Report Generated</th>
    </tr>
  );

  const renderTableRows = () => {
    if (filteredEmployees.length > 0) {
      return filteredEmployees.map((employee) => (
        <tr key={employee.id}>
          <td>{employee.id}</td>
          <td>{employee.hrManager}</td>
          <td>{employee.location}</td>
          <td>{employee.employeeName}</td>
          <td>{employee.status}</td>
          <td>{employee.package}</td>
          <td>{employee.reportGenerated}</td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan="7">
            No employees found for the specified filter and search criteria.
          </td>
        </tr>
      );
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Manager Dashboard Overview</h3>
      </div>
      <div className="main-cards row">
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card" onClick={() => handleFilter("all")}>
            <div className="card-inner">
              <h4>Total HRs</h4>
              <BsFillArchiveFill className="card_icon" />
            </div>
            <h1>{dashboardData.totalHRs}</h1>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card" onClick={() => handleFilter("all")}>
            <div className="card-inner">
              <h4>Total Employees</h4>
              <BsPeopleFill className="card_icon" />
            </div>
            <h1>{dashboardData.totalEmployees}</h1>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card" onClick={() => handleFilter("all")}>
            <div className="card-inner">
              <h4>Total Camps</h4>
              <BsFillGrid3X3GapFill className="card_icon" />
            </div>
            <h1>{dashboardData.totalCamps}</h1>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card" onClick={() => handleFilter("all")}>
            <div className="card-inner">
              <h4>Reports Generated</h4>
              <BsFillBarChartFill className="card_icon" />
            </div>
            <h1>{dashboardData.reportsGenerated}</h1>
          </div>
        </div>
      </div>
      <div className="actions mt-4 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="btn btn-secondary" onClick={handleDownload}>
          Download Excel
        </button>
      </div>

      <div className="employee-table">
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm mt-3">
            <thead>{renderTableHeaders()}</thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Overview;
