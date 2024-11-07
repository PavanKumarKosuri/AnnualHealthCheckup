import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Modal, Table } from "react-bootstrap";
import api from "../../../../api/apiService";
import { toast } from "react-toastify";
import DataTable from "../../../common/DataTable";
import ConfirmationModal from "../../../common/ConfirmationModal";

const PackageSettings = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: "", description: "" });
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [newSubpackage, setNewSubpackage] = useState({
    package_id: "",
    name: "",
    description: "",
  });
  const [showAddSubpackageModal, setShowAddSubpackageModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [subpackages, setSubpackages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPackage, setEditedPackage] = useState(null);
  const [editedSubpackages, setEditedSubpackages] = useState([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast.error("Failed to fetch clients.");
    }
  };

  const handleClientSelect = async (clientId) => {
    try {
      setSelectedClient(clientId);
      const response = await api.get(`packages/clients/${clientId}/packages`);
      setPackages(response.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
      toast.error("Failed to fetch packages.");
    }
  };

  const handleAddPackage = async () => {
    try {
      if (!newPackage.name.trim()) {
        toast.error("Package name is required.");
        return;
      }
      const selectedClientData = clients.find(
        (client) => client.id === selectedClient
      );
      if (!selectedClientData) {
        toast.error("Selected client not found.");
        return;
      }
      await api.post("/packages", {
        ...newPackage,
        client_id: selectedClientData.id,
      });
      toast.success("Package added successfully!");
      setNewPackage({ name: "", description: "" });
      setShowAddPackageModal(false);
      handleClientSelect(selectedClient);
    } catch (err) {
      console.error("Error adding package:", err);
      toast.error("Failed to add package.");
    }
  };

  const handleAddSubpackage = async () => {
    try {
      if (!newSubpackage.name.trim() || !newSubpackage.package_id) {
        toast.error("Subpackage name and package are required.");
        return;
      }
      await api.post("/subpackages", newSubpackage);
      toast.success("Subpackage added successfully!");
      setNewSubpackage({ package_id: "", name: "", description: "" });
      setShowAddSubpackageModal(false);
      if (selectedPackage && selectedPackage.id === newSubpackage.package_id) {
        fetchSubpackages(selectedPackage.id);
      }
    } catch (err) {
      console.error("Error adding subpackage:", err);
      toast.error("Failed to add subpackage.");
    }
  };

  const handleView = async (pkg) => {
    setSelectedPackage(pkg);
    await fetchSubpackages(pkg.id);
    setShowViewModal(true);
  };

  const fetchSubpackages = async (packageId) => {
    try {
      const response = await api.get(`/subpackages/packages/${packageId}`);
      setSubpackages(response.data);
    } catch (err) {
      console.error("Error fetching subpackages:", err);
      toast.error("Failed to fetch subpackages.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPackage({ ...selectedPackage });
    setEditedSubpackages([...subpackages]);
  };

  const handleSave = async () => {
    try {
      const packageData = {
        name: editedPackage.name,
        description: editedPackage.description,
        client_id: editedPackage.client_id,
      };
      await api.put(`/packages/${editedPackage.id}`, packageData);

      for (const subpackage of editedSubpackages) {
        await api.put(`/subpackages/${subpackage.id}`, {
          name: subpackage.name,
          description: subpackage.description,
        });
      }

      toast.success("Package and subpackages updated successfully!");

      setIsEditing(false);
      setSelectedPackage(packageData);
      setSubpackages(editedSubpackages);

      handleClientSelect(selectedClient);

      setShowViewModal(false);
    } catch (err) {
      console.error("Error updating package and subpackages:", err);
      toast.error("Failed to update package and subpackages.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPackage(null);
    setEditedSubpackages([]);
  };

  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    setEditedPackage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubpackageChange = (index, e) => {
    const { name, value } = e.target;
    setEditedSubpackages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const handleDeletePackage = async () => {
    try {
      await api.delete(`/packages/${selectedPackage.id}`);
      toast.success("Package deleted successfully!");
      setShowViewModal(false);
      setShowDeleteConfirmModal(false);
      handleClientSelect(selectedClient);
    } catch (err) {
      console.error("Error deleting package:", err);
      toast.error("Failed to delete package.");
    }
  };

  const handleDeleteSubpackage = async (subpackageId) => {
    try {
      await api.delete(`/subpackages/${subpackageId}`);
      toast.success("Subpackage deleted successfully!");

      const updatedSubpackages = editedSubpackages.filter(
        (sp) => sp.id !== subpackageId
      );
      setEditedSubpackages(updatedSubpackages);
    } catch (err) {
      console.error("Error deleting subpackage:", err);
      toast.error("Failed to delete subpackage.");
    }
  };

  const columns = [
    { header: "Package ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
  ];

  return (
    <div className="container mt-4">
      <h2>Package Settings</h2>
      <Form.Group className="mb-3">
        <Form.Label>Select Client</Form.Label>
        <Form.Select
          onChange={(e) => handleClientSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select a Client
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {selectedClient && (
        <>
          <Button
            variant="outline-dark"
            className="mb-3"
            onClick={() => setShowAddPackageModal(true)}
          >
            Add Package
          </Button>
          <Button
            variant="outline-secondary"
            className="mb-3 ms-2"
            onClick={() => setShowAddSubpackageModal(true)}
          >
            Add Subpackage
          </Button>
          <DataTable
            data={packages}
            columns={columns}
            isEditing={false}
            currentEdit={null}
            handleEditChange={() => {}}
            handleSave={() => {}}
            formFields={[]}
            actionButton={(pkg) => (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleView(pkg)}
              >
                View
              </Button>
            )}
          />
        </>
      )}

      {/* View/Edit Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Package" : "View Package"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPackage && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Package Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={isEditing ? editedPackage.name : selectedPackage.name}
                  onChange={handlePackageChange}
                  readOnly={!isEditing}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={
                    isEditing
                      ? editedPackage.description
                      : selectedPackage.description
                  }
                  onChange={handlePackageChange}
                  readOnly={!isEditing}
                />
              </Form.Group>
            </Form>
          )}
          <h5 className="mt-4">Subpackages</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                {isEditing && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {(isEditing ? editedSubpackages : subpackages).map(
                (subpackage, index) => (
                  <tr key={subpackage.id}>
                    <td>
                      <Form.Control
                        type="text"
                        name="name"
                        value={subpackage.name}
                        onChange={(e) => handleSubpackageChange(index, e)}
                        readOnly={!isEditing}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        name="description"
                        value={subpackage.description}
                        onChange={(e) => handleSubpackageChange(index, e)}
                        readOnly={!isEditing}
                      />
                    </td>
                    {isEditing && (
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteSubpackage(subpackage.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleEdit}>
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirmModal(true)}
              >
                Delete
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Add Package Modal */}
      <Modal
        show={showAddPackageModal}
        onHide={() => setShowAddPackageModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Package Name*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newPackage.name}
                onChange={(e) =>
                  setNewPackage((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter Package Name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newPackage.description}
                onChange={(e) =>
                  setNewPackage((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter Package Description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddPackageModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddPackage}>
            Add Package
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Subpackage Modal */}
      <Modal
        show={showAddSubpackageModal}
        onHide={() => setShowAddSubpackageModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Subpackage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Package*</Form.Label>
              <Form.Select
                name="package_id"
                value={newSubpackage.package_id}
                onChange={(e) =>
                  setNewSubpackage((prev) => ({
                    ...prev,
                    package_id: e.target.value,
                  }))
                }
                required
              >
                <option value="">Select Package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subpackage Name*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newSubpackage.name}
                onChange={(e) =>
                  setNewSubpackage((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter Subpackage Name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newSubpackage.description}
                onChange={(e) =>
                  setNewSubpackage((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter Subpackage Description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddSubpackageModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddSubpackage}>
            Add Subpackage
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteConfirmModal}
        title="Delete Confirmation"
        message="Are you sure you want to delete this package and all its subpackages? This action cannot be undone."
        onConfirm={handleDeletePackage}
        onCancel={() => setShowDeleteConfirmModal(false)}
      />
    </div>
  );
};

export default PackageSettings;
