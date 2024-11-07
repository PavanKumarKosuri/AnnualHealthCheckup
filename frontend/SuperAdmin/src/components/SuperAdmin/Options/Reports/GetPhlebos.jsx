import React, { useEffect, useState } from "react";
import { Button, Spinner, Table, Form, Row, Col } from "react-bootstrap";
import api from "../../../../api/apiService";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { downloadExcel } from "../../../../utils/Utils"; // Adjust the import path as needed

const animatedComponents = makeAnimated();
const ITEMS_PER_PAGE = 10;

const GetPhlebos = () => {
  const [phlebos, setPhlebos] = useState([]);
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phleboOptions, setPhleboOptions] = useState([]);

  useEffect(() => {
    fetchPhlebotomists();
    fetchClients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchPhlebotomists = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/phlebotomists");
      setPhlebos(response.data);
      const options = response.data.map((phlebo) => ({
        value: phlebo.id,
        label: phlebo.name,
        phoneNumber: phlebo.phoneNumber,
      }));
      setPhleboOptions(options);
    } catch (err) {
      console.error("Error fetching phlebotomists:", err);
      toast.error("Failed to fetch phlebotomists.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast.error("Failed to fetch clients.");
    }
  };

  const filteredPhlebos = phlebos.filter((phlebo) =>
    Object.keys(phlebo).some((key) =>
      phlebo[key]
        ? phlebo[key]
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : false
    )
  );

  const totalPages = Math.ceil(filteredPhlebos.length / ITEMS_PER_PAGE);
  const paginatedPhlebos = filteredPhlebos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mt-4">
      {/* Search Input */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <div style={{ width: "300px" }}>
          <Select
            components={animatedComponents}
            options={phleboOptions}
            onChange={(option) => setSearchTerm(option ? option.label : "")}
            placeholder="Search Phlebotomists..."
            isClearable
          />
        </div>
        <div style={{ width: "300px" }}>
          <Button
            variant="outline-primary"
            onClick={() =>
              downloadExcel(phlebos, "phlebos_reports.xlsx", "Phlebotomists")
            }
          >
            Download Excel
          </Button>
        </div>
      </div>

      {/* Phlebotomists Table */}
      <div style={{ overflowX: "auto" }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Unique ID</th>
              <th>Phone Number</th>
              <th>Age</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : paginatedPhlebos.length > 0 ? (
              paginatedPhlebos.map((phlebo) => (
                <tr key={phlebo.id}>
                  <td>{phlebo.id}</td>
                  <td>{phlebo.name}</td>
                  <td>{phlebo.uniqueId}</td>
                  <td>{phlebo.phoneNumber}</td>
                  <td>{phlebo.age}</td>
                  <td>{phlebo.gender}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No phlebotomists found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredPhlebos.length)} of{" "}
          {filteredPhlebos.length} entries
        </div>
        <div>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline-primary"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetPhlebos;
