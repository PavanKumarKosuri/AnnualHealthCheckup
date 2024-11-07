import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import api from "../../api/apiService";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import debounce from "lodash/debounce";
import * as XLSX from "xlsx";
import "../../styles/styles.css";

const Overview = () => {
  const client_id = localStorage.getItem("client_id");
  const hr_id = localStorage.getItem("hr_id");

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    unregisteredUsers: 0,
    samplesCollected: 0,
    samplesPending: 0,
    employees: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await api.get(`/hr/users/dashboard-metrics`, {
        params: { client_id: client_id, hr_id: hr_id },
      });
      setDashboardData((prevData) => ({
        ...prevData,
        totalUsers: response.data.totalRegistered,
        unregisteredUsers: response.data.totalUnregistered,
        samplesCollected: response.data.samplesCollected,
        samplesPending: response.data.samplesPending,
      }));
    } catch (error) {
      console.error("There was an error fetching the dashboard data!", error);
    }
  }, [client_id, hr_id]);

  const filterEmployees = useCallback(
    (employees, currentFilterType, currentSearchTerm) => {
      let filtered = employees;

      if (currentFilterType === "collected") {
        filtered = employees.filter((employee) => employee.reports_taken === 1);
      } else if (currentFilterType === "pending") {
        filtered = employees.filter((employee) => employee.reports_taken === 0);
      }

      if (currentSearchTerm) {
        filtered = filtered.filter((employee) =>
          Object.values(employee).some((val) =>
            String(val).toLowerCase().includes(currentSearchTerm.toLowerCase())
          )
        );
      }
      setFilteredEmployees(filtered);
    },
    []
  );

  const fetchUnregisteredUsers = useCallback(async () => {
    try {
      const response = await api.get(`/hr/users/unregistered`, {
        params: { client_id: client_id, hr_id: hr_id },
      });
      setDashboardData((prevData) => ({
        ...prevData,
        employees: response.data,
      }));
      filterEmployees(response.data, "unregistered", searchTerm);
    } catch (error) {
      console.error(
        "There was an error fetching the unregistered users!",
        error
      );
    }
  }, [client_id, hr_id, filterEmployees, searchTerm]);

  const debouncedFetchEmployees = useMemo(
    () =>
      debounce(
        async (
          currentFilterType,
          currentClientId,
          currentHrId,
          currentSearchTerm
        ) => {
          try {
            const response = await api.get(`/hr/users/by-hr`, {
              params: {
                client_id: currentClientId,
                hr_id: currentHrId,
                filterType: currentFilterType,
              },
            });
            setDashboardData((prevData) => ({
              ...prevData,
              employees: response.data,
            }));
            filterEmployees(
              response.data,
              currentFilterType,
              currentSearchTerm
            );
          } catch (error) {
            console.error(
              "There was an error fetching the employees by HR!",
              error
            );
          }
        },
        1000
      ),
    [filterEmployees]
  );

  const fetchEmployeesByLocation = useCallback(
    (currentFilterType) => {
      debouncedFetchEmployees(currentFilterType, client_id, hr_id, searchTerm);
    },
    [client_id, hr_id, searchTerm, debouncedFetchEmployees]
  );

  useEffect(() => {
    fetchDashboardData();
    if (filterType === "unregistered") {
      fetchUnregisteredUsers();
    } else {
      fetchEmployeesByLocation(filterType);
    }
  }, [
    filterType,
    fetchDashboardData,
    fetchUnregisteredUsers,
    fetchEmployeesByLocation,
  ]);

  const handleSearch = (e) => {
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);
    filterEmployees(dashboardData.employees, filterType, newSearchTerm);
  };

  const handleFilter = (newFilterType) => {
    setFilterType(newFilterType);
    if (newFilterType === "unregistered") {
      fetchUnregisteredUsers();
    } else {
      fetchEmployeesByLocation(newFilterType);
    }
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEmployees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "employees.xlsx");
  };

  const renderTableHeaders = () => {
    if (filterType === "unregistered") {
      return (
        <tr>
          <th>ID</th>
          <th>Employee ID</th>
          <th>Email</th>
          <th>Name</th>
          <th>Phone Number</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th>ID</th>
          <th>Phone Number</th>
          <th>Patient Name</th>
          <th>Employee ID</th>
          <th>Email</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Package</th>
          <th>Sub Package</th>
          <th>Booking Id</th>
          <th>Sample Status</th>
          <th>Additional Info</th>
        </tr>
      );
    }
  };

  const renderTableRows = () => {
    if (filteredEmployees.length > 0) {
      return filteredEmployees.map((employee) => {
        if (filterType === "unregistered") {
          return (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.employeeId}</td>
              <td>{employee.email}</td>
              <td>{employee.name}</td>
              <td>{employee.phoneNumber}</td>
            </tr>
          );
        } else {
          return (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.phone_number}</td>
              <td>{employee.name}</td>
              <td>{employee.employee_id}</td>
              <td>{employee.email}</td>
              <td>{employee.age}</td>
              <td>{employee.gender}</td>
              <td>{employee.package}</td>
              <td>{employee.sub_package}</td>
              <td>{employee.booking_id}</td>
              <td>{employee.reports_taken === 1 ? "Collected" : "Pending"}</td>
              <td>{employee.additional_info}</td>
            </tr>
          );
        }
      });
    } else {
      return (
        <tr>
          <td colSpan={filterType === "unregistered" ? "5" : "12"}>
            No employees found for the specified filter and search criteria.
          </td>
        </tr>
      );
    }
  };
  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Overview</h3>
      </div>
      <div className="main-cards row">
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div
            className="card"
            onClick={() => handleFilter("all")}
            style={{ backgroundColor: "" }}
          >
            <div className="card-inner">
              <h4>Registered Users</h4>
              <BsFillArchiveFill className="card_icon" />
            </div>
            <h1>{dashboardData.totalUsers}</h1>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card" onClick={() => handleFilter("unregistered")}>
            <div className="card-inner">
              <h4>Unregistered Users</h4>
              <BsPeopleFill className="card_icon" />
            </div>
            <h1>{dashboardData.unregisteredUsers}</h1>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card" onClick={() => handleFilter("collected")}>
            <div className="card-inner">
              <h4>Samples Collected</h4>
              <BsFillGrid3X3GapFill className="card_icon" />
            </div>
            <h1>{dashboardData.samplesCollected}</h1>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card" onClick={() => handleFilter("pending")}>
            <div className="card-inner">
              <h4>Samples Pending</h4>
              <BsPeopleFill className="card_icon" />
            </div>
            <h1>{dashboardData.samplesPending}</h1>
          </div>
        </div>
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

Overview.propTypes = {
  clientId: PropTypes.string.isRequired,
  hrId: PropTypes.string.isRequired,
};

export default Overview;
