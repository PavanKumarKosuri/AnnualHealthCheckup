import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import OnsiteRegs from "./OnsiteRegs";
import OffsiteRegs from "./OffsiteRegs";
import HomeRegs from "./HomeRegs";
// Assuming `api` is defined in the actual code
// import api from "../../api/apiService";

const Registrations = () => {
  // Hardcoded client services for testing purposes
  const [clientServices] = useState({
    onsite: true,
    offsite: true,
    home: true,
  });
  const [selectedType, setSelectedType] = useState(null);

  // You can uncomment this once real API is available
  /*
  useEffect(() => {
    const fetchClientServices = async () => {
      try {
        const clientId = localStorage.getItem("clientId");
        const response = await api.get(`/clients/${clientId}`);
        setClientServices({
          onsite: response.data.services_requested_onsite,
          offsite: response.data.services_requested_offsite,
          home: response.data.services_requested_homecollection,
        });
      } catch (error) {
        console.error("Error fetching client services:", error);
      }
    };

    fetchClientServices();
  }, []);
  */

  const renderRegistrationComponent = () => {
    switch (selectedType) {
      case "onsite":
        return <OnsiteRegs />;
      case "offsite":
        return <OffsiteRegs />;
      case "home":
        return <HomeRegs />;
      default:
        return null;
    }
  };

  return (
    <Container className="mt-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center mb-4">
          Employee Health Check-up Registration
        </h2>
      </motion.div>

      {!selectedType ? (
        <Row className="justify-content-center">
          {clientServices.onsite && (
            <Col md={4} className="mb-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>Onsite Collection</Card.Title>
                    <Card.Text>
                      Register for health check-up at your company premises.
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="mt-auto"
                      onClick={() => setSelectedType("onsite")}
                    >
                      Select
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          )}
          {clientServices.offsite && (
            <Col md={4} className="mb-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>Offsite Collection</Card.Title>
                    <Card.Text>
                      Register for health check-up at a diagnostic center.
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="mt-auto"
                      onClick={() => setSelectedType("offsite")}
                    >
                      Select
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          )}
          {clientServices.home && (
            <Col md={4} className="mb-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>Home Collection</Card.Title>
                    <Card.Text>
                      Register for health check-up at your home.
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="mt-auto"
                      onClick={() => setSelectedType("home")}
                    >
                      Select
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          )}
        </Row>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderRegistrationComponent()}
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => setSelectedType(null)}
          >
            Back to Selection
          </Button>
        </motion.div>
      )}
    </Container>
  );
};

export default Registrations;
