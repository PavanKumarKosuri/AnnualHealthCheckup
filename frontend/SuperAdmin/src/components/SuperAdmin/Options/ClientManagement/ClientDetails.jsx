import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../api/apiService";
import {
  Card,
  ListGroup,
  Badge,
  Button,
  Spinner,
  Collapse,
} from "react-bootstrap";
import { toast } from "react-toastify";

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [packages, setPackages] = useState([]);
  const [subpackages, setSubpackages] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedPackages, setExpandedPackages] = useState({});
  const [loadingSubpackages, setLoadingSubpackages] = useState({});

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await api.get(`/clients/${id}`);
        setClient(response.data);

        const packagesResponse = await api.get(`packages/clients/${id}/packages`);
        setPackages(packagesResponse.data);
      } catch (err) {
        console.error("Error fetching client details:", err);
        toast.error("Failed to fetch client details.");
      } finally {
        setLoading(false);
      }
    };
    fetchClientDetails();
  }, [id]);

  const renderServices = (client) => {
    const services = [];
    if (client.servicesRequestedOnsite === 1) services.push("Onsite");
    if (client.servicesRequestedOffsite === 1) services.push("Offsite");
    if (client.servicesRequestedHomecollection === 1)
      services.push("Home Collection");
    return services.join(", ") || "None";
  };

  const togglePackage = async (packageId) => {
    setExpandedPackages((prev) => ({
      ...prev,
      [packageId]: !prev[packageId],
    }));

    if (!expandedPackages[packageId] && !subpackages[packageId]) {
      setLoadingSubpackages((prev) => ({
        ...prev,
        [packageId]: true,
      }));
      try {
        const response = await api.get(`subpackages/packages/${packageId}`);
        setSubpackages((prev) => ({
          ...prev,
          [packageId]: response.data,
        }));
      } catch (err) {
        console.error(
          `Error fetching subpackages for package ${packageId}:`,
          err
        );
        toast.error("Failed to fetch subpackages.");
      } finally {
        setLoadingSubpackages((prev) => ({
          ...prev,
          [packageId]: false,
        }));
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!client) {
    return <div className="container mt-4">Client not found.</div>;
  }

  return (
    <div className="container mt-4">
      {/* Client Information Card */}
      <h2>Client Details</h2>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>{client.name}</Card.Title>
          <Card.Text>
            <strong>Client ID:</strong> {client.clientId}
            <br />
            <strong>Email:</strong> {client.email}
            <br />
            <strong>Phone Number:</strong> {client.phoneNumber}
            <br />
            <strong>City:</strong> {client.city}
            <br />
            <strong>Services Requested:</strong> {renderServices(client)}
          </Card.Text>
          <Card.Text>
            <strong>Compliance Certifications:</strong>{" "}
            {client.complianceCertifications || "N/A"}
            <br />
            <strong>SLA Details:</strong> {client.slaDetails || "N/A"}
            <br />
            <strong>Insurance Details:</strong>{" "}
            {client.insuranceDetails || "N/A"}
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Packages List */}
      <h3>Packages</h3>
      <ListGroup>
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <ListGroup.Item key={pkg.id}>
              {/* Package Header with Toggle Button */}
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{pkg.name}</strong>:{" "}
                  {pkg.description || "No description"}
                </div>
                <Button
                  variant="link"
                  onClick={() => togglePackage(pkg.id)}
                  aria-controls={`collapse-subpackages-${pkg.id}`}
                  aria-expanded={!!expandedPackages[pkg.id]}
                >
                  {expandedPackages[pkg.id]
                    ? "Hide Subpackages"
                    : "View Subpackages"}
                </Button>
              </div>

              {/* Subpackages Collapse Section */}
              <Collapse in={!!expandedPackages[pkg.id]}>
                <div id={`collapse-subpackages-${pkg.id}`}>
                  <ListGroup className="mt-2">
                    {loadingSubpackages[pkg.id] ? (
                      <div className="d-flex justify-content-center">
                        <Spinner animation="border" size="sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </div>
                    ) : subpackages[pkg.id] ? (
                      subpackages[pkg.id].length > 0 ? (
                        subpackages[pkg.id].map((subpkg, index) => (
                          <ListGroup.Item key={subpkg.id}>
                            {/* Display sequential number instead of subpackage ID */}
                            <Badge bg="secondary" className="me-2">
                              {index + 1}
                            </Badge>
                            <strong>{subpkg.name}</strong>:{" "}
                            {subpkg.description || "No description"}
                          </ListGroup.Item>
                        ))
                      ) : (
                        <ListGroup.Item>
                          No subpackages available.
                        </ListGroup.Item>
                      )
                    ) : (
                      <ListGroup.Item>No subpackages available.</ListGroup.Item>
                    )}
                  </ListGroup>
                </div>
              </Collapse>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No packages available.</ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};

export default ClientDetails;
