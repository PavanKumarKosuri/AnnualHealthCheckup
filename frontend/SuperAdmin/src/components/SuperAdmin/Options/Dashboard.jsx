import React, { useState, useEffect, useRef } from "react";
import api from "../../../api/apiService";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Spinner,
  Alert,
  Dropdown,
} from "react-bootstrap";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    samplesCollected: 0,
    samplesPending: 0,
  });

  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const [filters, setFilters] = useState({
    clientId: "",
    city: "",
    companyName: "",
  });

  const [clients, setClients] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [companyNameOptions, setCompanyNameOptions] = useState([]);
  const [showCityOptions, setShowCityOptions] = useState(false);
  const [showCompanyNameOptions, setShowCompanyNameOptions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cityInputRef = useRef(null);
  const companyInputRef = useRef(null);

  useEffect(() => {
    fetchClients();
    fetchDashboardData();

    return () => {
      debouncedFetchCityOptions.cancel();
      debouncedFetchCompanyNameOptions.cancel();
    };
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients.");
    }
  };

  const fetchDashboardData = async (currentFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/dashboard", { params: currentFilters });
      const { summary, barChartData, pieChartData } = response.data;

      setDashboardData(summary);
      setBarChartData(barChartData);
      setPieChartData(pieChartData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data.");
      toast.error("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCityOptions = async (query) => {
    if (!query.trim()) {
      setCityOptions([]);
      return;
    }
    try {
      const response = await api.get("/users/city-options", {
        params: { query },
      });
      setCityOptions(response.data.map((item) => item.name));
    } catch (error) {
      console.error("Error fetching city options:", error);
      toast.error("Failed to fetch city options.");
    }
  };

  const fetchCompanyNameOptions = async (query) => {
    if (!query.trim()) {
      setCompanyNameOptions([]);
      return;
    }
    try {
      const response = await api.get("/users/company-name-options", {
        params: { query },
      });
      setCompanyNameOptions(response.data.map((item) => item.name));
    } catch (error) {
      console.error("Error fetching company name options:", error);
      toast.error("Failed to fetch company name options.");
    }
  };

  const debouncedFetchCityOptions = useRef(
    debounce((query) => {
      fetchCityOptions(query);
    }, 300)
  ).current;

  const debouncedFetchCompanyNameOptions = useRef(
    debounce((query) => {
      fetchCompanyNameOptions(query);
    }, 300)
  ).current;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "city") {
      debouncedFetchCityOptions(value);
      setShowCityOptions(true);
    } else if (name === "companyName") {
      debouncedFetchCompanyNameOptions(value);
      setShowCompanyNameOptions(true);
    }
  };

  const handleFilter = () => {
    fetchDashboardData(filters);
  };

  const handleClear = () => {
    setFilters({
      clientId: "",
      city: "",
      companyName: "",
    });
    setCityOptions([]);
    setCompanyNameOptions([]);
    fetchDashboardData();
  };

  const handleCityOptionClick = (name) => {
    setFilters((prev) => ({ ...prev, city: name }));
    setShowCityOptions(false);
  };

  const handleCompanyNameOptionClick = (name) => {
    setFilters((prev) => ({ ...prev, companyName: name }));
    setShowCompanyNameOptions(false);
  };

  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    setFilters((prev) => ({ ...prev, clientId }));
  };

  const handleClickOutside = (e) => {
    if (
      cityInputRef.current &&
      !cityInputRef.current.contains(e.target) &&
      showCityOptions
    ) {
      setShowCityOptions(false);
    }
    if (
      companyInputRef.current &&
      !companyInputRef.current.contains(e.target) &&
      showCompanyNameOptions
    ) {
      setShowCompanyNameOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCityOptions, showCompanyNameOptions]);

  const handleCityInputFocus = () => {
    if (filters.city) {
      fetchCityOptions(filters.city);
    }
    setShowCityOptions(true);
  };

  const handleCompanyNameInputFocus = () => {
    if (filters.companyName) {
      fetchCompanyNameOptions(filters.companyName);
    }
    setShowCompanyNameOptions(true);
  };

  const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#A28CF0", "#82ca9d"];

  return (
    <Container fluid style={{ padding: "20px" }}>
      {/* Title */}
      <Row style={{ marginBottom: "20px" }}>
        <Col>
          <h3>DASHBOARD</h3>
        </Col>
      </Row>

      {/* Filters Section */}
      <Row style={{ marginBottom: "20px" }}>
        {/* Client Filter */}
        <Col xs={12} md={4} style={{ marginBottom: "10px" }}>
          <Form.Group controlId="formClientSelect">
            <Form.Label>Client</Form.Label>
            <Form.Control
              as="select"
              name="clientId"
              value={filters.clientId}
              onChange={handleClientSelect}
              style={{ height: "38px" }}
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* City Autocomplete */}
        <Col xs={12} md={4} style={{ marginBottom: "10px" }}>
          <Form.Group controlId="formCity">
            <Form.Label>City</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter City"
                name="city"
                value={filters.city}
                onChange={handleInputChange}
                onFocus={handleCityInputFocus}
                ref={cityInputRef}
                style={{ position: "relative", zIndex: "1" }}
              />
            </InputGroup>
            {showCityOptions && cityOptions.length > 0 && (
              <Dropdown.Menu
                show
                style={{ width: "100%", maxHeight: "200px", overflowY: "auto" }}
              >
                {cityOptions.map((option, index) => (
                  <Dropdown.Item
                    key={`${option}-${index}`}
                    onClick={() => handleCityOptionClick(option)}
                  >
                    {option}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            )}
          </Form.Group>
        </Col>

        {/* Company Name Autocomplete */}
        <Col xs={12} md={4} style={{ marginBottom: "10px" }}>
          <Form.Group controlId="formCompanyName">
            <Form.Label>Company Name</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter Company Name"
                name="companyName"
                value={filters.companyName}
                onChange={handleInputChange}
                onFocus={handleCompanyNameInputFocus}
                ref={companyInputRef}
                style={{ position: "relative", zIndex: "1" }}
              />
            </InputGroup>
            {showCompanyNameOptions && companyNameOptions.length > 0 && (
              <Dropdown.Menu
                show
                style={{ width: "100%", maxHeight: "200px", overflowY: "auto" }}
              >
                {companyNameOptions.map((option, index) => (
                  <Dropdown.Item
                    key={`${option}-${index}`}
                    onClick={() => handleCompanyNameOptionClick(option)}
                  >
                    {option}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Buttons Section */}
      <Row style={{ marginBottom: "40px" }}>
        <Col xs={12} md={6} style={{ marginBottom: "10px" }}>
          <Button
            variant="outline-dark"
            onClick={handleFilter}
            disabled={loading}
            style={{ width: "100%", height: "38px" }}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Filtering...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </Col>
        <Col xs={12} md={6}>
          <Button
            variant="outline-dark"
            onClick={handleClear}
            disabled={loading}
            style={{ width: "100%", height: "38px" }}
          >
            Clear
          </Button>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row style={{ marginBottom: "20px" }}>
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Summary Cards */}
      <Row style={{ marginBottom: "40px" }}>
        <Col xs={12} md={4} style={{ marginBottom: "20px" }}>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div>
              <h5>Total Users</h5>
              <BsFillArchiveFill size={30} color="#3498db" />
            </div>
            <h3 style={{ margin: "0", color: "#333" }}>
              {dashboardData.totalUsers}
            </h3>
          </div>
        </Col>

        <Col xs={12} md={4} style={{ marginBottom: "20px" }}>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div>
              <h5>Samples Collected</h5>
              <BsFillGrid3X3GapFill size={30} color="#2ecc71" />
            </div>
            <h3 style={{ margin: "0", color: "#333" }}>
              {dashboardData.samplesCollected}
            </h3>
          </div>
        </Col>

        <Col xs={12} md={4}>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div>
              <h5>Samples Pending</h5>
              <BsPeopleFill size={30} color="#e74c3c" />
            </div>
            <h3 style={{ margin: "0", color: "#333" }}>
              {dashboardData.samplesPending}
            </h3>
          </div>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row>
        {/* Bar Chart */}
        <Col xs={12} md={6} style={{ marginBottom: "40px" }}>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "100%",
            }}
          >
            <h5 style={{ marginBottom: "20px" }}>Samples Overview by Client</h5>
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="clientName" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="collected" fill="#82ca9d" name="Collected" />
                  <Bar dataKey="pending" fill="#FFBFA9" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No data available for the selected filters.</p>
            )}
          </div>
        </Col>

        {/* Pie Chart */}
        <Col xs={12} md={6}>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "100%",
            }}
          >
            <h5 style={{ marginBottom: "20px" }}>Samples Distribution</h5>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>No data available for the selected filters.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
