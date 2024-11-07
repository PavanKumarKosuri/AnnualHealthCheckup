import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../../api/apiService";
import debounce from "lodash/debounce";
import * as XLSX from "xlsx";
import { Button, Form, Table, Modal } from "react-bootstrap";
import QRCode from "react-qr-code";
import checkMedLogo from "../../assets/checkmed_newlogo.png";
import { qrCodeLink } from "../../../qrCodeLink";
import { saveAs } from "file-saver";

// Utility function for setting messages with auto-clear
const useMessage = (initialState = "") => {
  const [message, setMessage] = useState(initialState);

  const setMessageWithTimeout = useCallback((newMessage) => {
    setMessage(newMessage);
    setTimeout(() => setMessage(""), 5000);
  }, []);

  return [message, setMessageWithTimeout];
};

const Employees = () => {
  const client_id = localStorage.getItem("client_id") || "";
  const hr_id = localStorage.getItem("hr_id") || "";

  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useMessage("");
  const [successMessage, setSuccessMessage] = useMessage("");
  const [uploading, setUploading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    employeeId: "",
    email: "",
    name: "",
    phoneNumber: "",
    client_id,
    hr_id,
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, [client_id, hr_id]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/hr/eligibleEmployees/get/${client_id}/${hr_id}`
      );
      setEmployees(response.data.reverse());
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching employees data:", error);
      setErrorMessage("Failed to fetch employees data.");
      setIsLoading(false);
    }
  };

  const handleFileChange = useCallback(
    debounce((e) => {
      const file = e.target.files[0];
      setFile(file);
      setErrorMessage("");
      readExcelFile(file);
    }, 300),
    []
  );

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage(
        "Please upload the employee's list in an excel file to proceed."
      );
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await api.post(
        `/hr/eligibleEmployees/upload/${client_id}/${hr_id}`,
        formData
      );

      if (response.status === 200) {
        let successMsg = response.data.message || "File uploaded successfully.";
        setSuccessMessage(successMsg);
        fetchEmployees();
      } else {
        setErrorMessage("Error uploading file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage(
        "Error uploading file: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.email) {
      setErrorMessage("Email is required.");
      return;
    }

    if (
      employees.some(
        (emp) =>
          emp.employeeId === newEmployee.employeeId ||
          emp.email === newEmployee.email
      )
    ) {
      setErrorMessage("Duplicate entry. Employee ID or email already exists.");
      return;
    }
    try {
      const response = await api.post("/hr/eligibleEmployees/add", newEmployee);
      if (response.status === 200) {
        setSuccessMessage("Employee added successfully.");
        fetchEmployees();
        setNewEmployee({
          employeeId: "",
          email: "",
          name: "",
          phoneNumber: "",
          client_id,
          hr_id,
        });
      } else {
        setErrorMessage("Error adding employee.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      setErrorMessage("Error adding employee.");
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingId(employee.id);
    setNewEmployee({
      employeeId: employee.employeeId,
      email: employee.email,
      name: employee.name,
      phoneNumber: employee.phoneNumber,
      client_id: employee.client_id,
      hr_id: employee.hr_id,
    });
  };

  const handleSaveEmployee = async (id) => {
    try {
      const response = await api.put(
        `/hr/eligibleEmployees/${id}/update`,
        newEmployee
      );
      if (response.status === 200) {
        setSuccessMessage("Employee updated successfully.");
        fetchEmployees();
        setEditingId(null);
      } else {
        setErrorMessage("Error updating employee.");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      setErrorMessage("Error updating employee.");
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await api.delete(`/hr/eligibleEmployees/${id}/delete`, {
        data: {
          client_id,
          hr_id,
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Employee deleted successfully.");
        fetchEmployees();
      } else {
        setErrorMessage("Error deleting employee.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      setErrorMessage("Error deleting employee.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setErrorMessage("");
  };

  const handleAddNewRow = () => {
    setNewEmployee({
      employeeId: "",
      email: "",
      name: "",
      phoneNumber: "",
      client_id,
      hr_id,
    });
    setEditingId("new");
  };

  const renderTable = (data) => (
    <div className="table-responsive" style={{ overflowX: "auto" }}>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Emp ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {editingId === "new" && (
            <tr>
              <td>New</td>
              <td>
                <Form.Control
                  type="text"
                  value={newEmployee.employeeId}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      employeeId: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      email: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      name: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={newEmployee.phoneNumber}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={handleAddEmployee}
                >
                  Save
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </td>
            </tr>
          )}
          {data.map((employee) => (
            <tr key={employee.id}>
              {editingId === employee.id ? (
                <>
                  <td>{employee.id}</td>
                  <td>
                    <Form.Control
                      type="text"
                      value={newEmployee.employeeId}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          employeeId: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          email: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={newEmployee.name}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          name: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={newEmployee.phoneNumber}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleSaveEmployee(employee.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{employee.id}</td>
                  <td>{employee.employeeId}</td>
                  <td>{employee.email}</td>
                  <td>{employee.name}</td>
                  <td>{employee.phoneNumber}</td>
                  <td>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  const handleDownloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ["employeeId", "email", "name", "phoneNumber", "client_id", "hr_id"],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "eligibleEmployee_template.xlsx");
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3 main-title">Employees in your Org</h3>
      <div className="mb-3">
        <strong>Total Employees - {employees.length}</strong>
      </div>
      <div className="button-group mb-3 row">
        <div className="col-sm-6 col-md-4 col-lg-auto mb-2">
          <Button
            variant="outline-dark"
            className="w-100"
            onClick={handleAddNewRow}
          >
            Add an Entry
          </Button>
        </div>
        <div className="col-sm-6 col-md-4 col-lg-auto mb-2">
          <Button
            variant="outline-dark"
            className="w-100"
            onClick={() => setShowUploadModal(true)}
          >
            Upload Data
          </Button>
        </div>
        <div className="col-sm-6 col-md-4 col-lg-auto mb-2">
          <Button
            variant="outline-dark"
            className="w-100"
            onClick={() => setShowQRModal(true)}
          >
            View QR
          </Button>
        </div>
        <div className="col-sm-6 col-md-4 col-lg-auto mb-2">
          <Button
            variant="outline-dark"
            className="w-100"
            onClick={handleDownloadTemplate}
          >
            Download Template
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger mt-3">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="alert alert-success mt-3">{successMessage}</div>
      )}
      {renderTable(employees)}

      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="file" className="mb-3">
              <Form.Label>Upload Excel Sheet</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </Form.Group>
            {uploading ? (
              <div className="alert alert-info mt-3">
                Uploading, please wait...
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className="alert alert-danger mt-3">{errorMessage}</div>
                )}
                <Button
                  type="submit"
                  variant="outline-dark"
                  disabled={uploading}
                >
                  Submit
                </Button>
                {successMessage && (
                  <div className="alert alert-success mt-3">
                    {successMessage}
                  </div>
                )}
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>

      <QRModal
        show={showQRModal}
        onClose={() => setShowQRModal(false)}
        clientId={client_id}
        hrId={hr_id}
        qrCodeValue={`${qrCodeLink}/${encodeURIComponent(
          client_id
        )}/${encodeURIComponent(hr_id)}`}
      />
    </div>
  );
};

const QRModal = ({ show, onClose, clientId, hrId, qrCodeValue }) => {
  const downloadQR = () => {
    const qrCodeContainer = document.querySelector(".qr-code-container");
    const svg = qrCodeContainer.querySelector("svg");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Maintain a larger size for the downloaded QR code
    canvas.width = 400;
    canvas.height = 500;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = checkMedLogo;

    img.onload = () => {
      const logoWidth = canvas.width * 0.35;
      const aspectRatio = img.width / img.height;
      const logoHeight = logoWidth / aspectRatio;

      ctx.drawImage(
        img,
        (canvas.width - logoWidth) / 2,
        10,
        logoWidth,
        logoHeight
      );

      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(`${clientId}, ${hrId}`, canvas.width / 2, 100);

      ctx.font = "16px Arial";
      ctx.fillStyle = "red";
      ctx.fillText(
        "Please scan the below QR code to register/login",
        canvas.width / 2,
        130
      );

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);
      const img2 = new Image();

      img2.onload = () => {
        ctx.drawImage(img2, (canvas.width - 200) / 2, 150, 200, 200);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          saveAs(blob, "qr_code.png");
        });
      };
      img2.src = url;
    };
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "18px" }}>
          Generated QR Code
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <div className="qr-code-container my-3">
            <QRCode
              value={qrCodeValue}
              size={150}
              style={{ marginBottom: "13px" }}
            />
            <br />
            <div
              style={{
                fontSize: "12px",
                overflowWrap: "break-word",
                wordWrap: "break-word",
                wordBreak: "break-all",
              }}
            >
              <a
                href={qrCodeValue}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "black" }}
              >
                {qrCodeValue}
              </a>
            </div>
          </div>
          <Button
            variant="primary"
            className="mx-2"
            onClick={downloadQR}
            style={{ fontSize: "14px", padding: "5px 10px" }}
          >
            Download QR Code
          </Button>
          <Button
            variant="secondary"
            className="mx-2"
            onClick={onClose}
            style={{ fontSize: "14px", padding: "5px 10px" }}
          >
            Back
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

QRModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
  hrId: PropTypes.string.isRequired,
  qrCodeValue: PropTypes.string.isRequired,
};

export default Employees;
