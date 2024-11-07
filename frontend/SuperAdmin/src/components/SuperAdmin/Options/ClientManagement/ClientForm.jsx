import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../../../api/apiService";

const ClientForm = ({ client = null, onClose, onClientAddedOrUpdated }) => {
  const isEditMode = Boolean(client);
  const [show, setShow] = useState(isEditMode ? true : false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const initialClientData = isEditMode
    ? {
        name: client.name || "",
        email: client.email || "",
        phoneNumber: client.phoneNumber || "",
        address: client.address || "",
        city: client.city || "",
        state: client.state || "",
        zipCode: client.zipCode || "",
        country: client.country || "",
        registrationNumber: client.registrationNumber || "",
        taxId: client.taxId || "",
        industryType: client.industryType || "",
        numberOfEmployees: client.numberOfEmployees || "",
        annualRevenue: client.annualRevenue || "",
        servicesRequestedOnsite:
          client.servicesRequestedOnsite === 1 ? true : false,
        servicesRequestedOffsite:
          client.servicesRequestedOffsite === 1 ? true : false,
        servicesRequestedHomecollection:
          client.servicesRequestedHomecollection === 1 ? true : false,
        preferredServiceTimes: client.preferredServiceTimes || "",
        specialRequirements: client.specialRequirements || "",
        contactPersonName: client.contactPersonName || "",
        contactPersonDesignation: client.contactPersonDesignation || "",
        contactPersonPhoneNumber: client.contactPersonPhoneNumber || "",
        contactPersonEmail: client.contactPersonEmail || "",
        certifications: client.certifications || "",
        billingAddress: client.billingAddress || "",
        preferredPaymentMethods: client.preferredPaymentMethods || "",
        creditTerms: client.creditTerms || "",
        communicationChannels: client.communicationChannels
          ? client.communicationChannels.split(",").map((c) => c.trim())
          : [],
        integrationRequirements: client.integrationRequirements || "",
        notes: client.notes || "",
        complianceCertifications: client.complianceCertifications || "",
        dataIntegrationDetails: client.dataIntegrationDetails || "",
        slaDetails: client.slaDetails || "",
        insuranceDetails: client.insuranceDetails || "",
        consentAgreements: client.consentAgreements || "",
      }
    : {
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        registrationNumber: "",
        taxId: "",
        industryType: "",
        numberOfEmployees: "",
        annualRevenue: "",
        servicesRequestedOnsite: false,
        servicesRequestedOffsite: false,
        servicesRequestedHomecollection: false,
        preferredServiceTimes: "",
        specialRequirements: "",
        contactPersonName: "",
        contactPersonDesignation: "",
        contactPersonPhoneNumber: "",
        contactPersonEmail: "",
        certifications: "",
        billingAddress: "",
        preferredPaymentMethods: "",
        creditTerms: "",
        communicationChannels: [],
        integrationRequirements: "",
        notes: "",
        complianceCertifications: "",
        dataIntegrationDetails: "",
        slaDetails: "",
        insuranceDetails: "",
        consentAgreements: "",
      };

  const [clientData, setClientData] = useState(initialClientData);

  useEffect(() => {
    if (isEditMode) {
      setShow(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShow(false);
    setCurrentStep(1);
    setClientData(initialClientData);
    if (onClose) onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "communicationChannels") {
        const updatedChannels = [...clientData.communicationChannels];
        if (checked) {
          updatedChannels.push(value);
        } else {
          const index = updatedChannels.indexOf(value);
          if (index > -1) {
            updatedChannels.splice(index, 1);
          }
        }
        setClientData((prev) => ({
          ...prev,
          communicationChannels: updatedChannels,
        }));
      } else {
        setClientData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setClientData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!clientData.name.trim()) {
          toast.error("Client Name is required.");
          return false;
        }
        if (!clientData.email.trim()) {
          toast.error("Client Email is required.");
          return false;
        }
        if (!clientData.phoneNumber.trim()) {
          toast.error("Client Phone Number is required.");
          return false;
        }
        if (!clientData.address.trim()) {
          toast.error("Address is required.");
          return false;
        }
        return true;
      case 4:
        if (
          !clientData.servicesRequestedOnsite &&
          !clientData.servicesRequestedOffsite &&
          !clientData.servicesRequestedHomecollection
        ) {
          toast.error("At least one service must be selected.");
          return false;
        }
        if (!clientData.preferredServiceTimes.trim()) {
          toast.error("Preferred Service Times are required.");
          return false;
        }
        return true;
      case 5:
        if (!clientData.contactPersonName.trim()) {
          toast.error("Contact Person Name is required.");
          return false;
        }
        if (!clientData.contactPersonDesignation.trim()) {
          toast.error("Contact Person Designation is required.");
          return false;
        }
        if (!clientData.contactPersonPhoneNumber.trim()) {
          toast.error("Contact Person Phone Number is required.");
          return false;
        }
        if (!clientData.contactPersonEmail.trim()) {
          toast.error("Contact Person Email is required.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setLoading(true);
      try {
        const formattedData = {
          name: clientData.name,
          email: clientData.email,
          phoneNumber: clientData.phoneNumber,
          address: clientData.address,
          city: clientData.city,
          state: clientData.state,
          zipCode: clientData.zipCode,
          country: clientData.country,
          registrationNumber: clientData.registrationNumber,
          taxId: clientData.taxId,
          industryType: clientData.industryType,
          numberOfEmployees: clientData.numberOfEmployees,
          annualRevenue: clientData.annualRevenue,
          servicesRequestedOnsite: clientData.servicesRequestedOnsite,
          servicesRequestedOffsite: clientData.servicesRequestedOffsite,
          servicesRequestedHomecollection:
            clientData.servicesRequestedHomecollection,
          preferredServiceTimes: clientData.preferredServiceTimes,
          specialRequirements: clientData.specialRequirements,
          contactPersonName: clientData.contactPersonName,
          contactPersonDesignation: clientData.contactPersonDesignation,
          contactPersonPhoneNumber: clientData.contactPersonPhoneNumber,
          contactPersonEmail: clientData.contactPersonEmail,
          certifications: clientData.certifications,
          billingAddress: clientData.billingAddress,
          preferredPaymentMethods: clientData.preferredPaymentMethods,
          creditTerms: clientData.creditTerms,
          communicationChannels: clientData.communicationChannels,
          integrationRequirements: clientData.integrationRequirements,
          notes: clientData.notes,
          complianceCertifications: clientData.complianceCertifications,
          dataIntegrationDetails: clientData.dataIntegrationDetails,
          slaDetails: clientData.slaDetails,
          insuranceDetails: clientData.insuranceDetails,
          consentAgreements: clientData.consentAgreements,
        };


        let response;
        if (isEditMode) {
          response = await api.put(`/clients/${client.id}`, formattedData);
          toast.success("Client updated successfully!");
        } else {
          response = await api.post("/clients", formattedData);
          toast.success("Client added successfully!");
        }

        handleCloseModal();
        if (onClientAddedOrUpdated) {
          onClientAddedOrUpdated(response.data.client);
        }
      } catch (err) {
        console.error(
          `Error ${isEditMode ? "updating" : "adding"} client:`,
          err
        );
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(
            `Failed to ${isEditMode ? "update" : "add"} client: ${
              err.response.data.message
            }`
          );
        } else {
          toast.error(
            `Failed to ${
              isEditMode ? "update" : "add"
            } client. Please try again.`
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Form.Group as={Row} className="mb-3" controlId="name">
              <Form.Label column sm={4}>
                Client Name<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="name"
                  value={clientData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter client name"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="email">
              <Form.Label column sm={4}>
                Email<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="email"
                  name="email"
                  value={clientData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter client email"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="phoneNumber">
              <Form.Label column sm={4}>
                Phone Number<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={clientData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter client phone number"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="address">
              <Form.Label column sm={4}>
                Address<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="address"
                  value={clientData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter client address"
                />
              </Col>
            </Form.Group>
          </>
        );
      case 2:
        return (
          <>
            <Form.Group as={Row} className="mb-3" controlId="city">
              <Form.Label column sm={4}>
                City
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="city"
                  value={clientData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="state">
              <Form.Label column sm={4}>
                State
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="state"
                  value={clientData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="zipCode">
              <Form.Label column sm={4}>
                Zip Code
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="zipCode"
                  value={clientData.zipCode}
                  onChange={handleChange}
                  placeholder="Enter zip code"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="country">
              <Form.Label column sm={4}>
                Country
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="country"
                  value={clientData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                />
              </Col>
            </Form.Group>
          </>
        );
      case 3:
        return (
          <>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="registrationNumber"
            >
              <Form.Label column sm={4}>
                Registration Number
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="registrationNumber"
                  value={clientData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Enter registration number"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="taxId">
              <Form.Label column sm={4}>
                Tax ID
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="taxId"
                  value={clientData.taxId}
                  onChange={handleChange}
                  placeholder="Enter tax ID"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="industryType">
              <Form.Label column sm={4}>
                Industry Type
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="industryType"
                  value={clientData.industryType}
                  onChange={handleChange}
                  placeholder="Enter industry type"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="numberOfEmployees">
              <Form.Label column sm={4}>
                Number of Employees
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="number"
                  name="numberOfEmployees"
                  value={clientData.numberOfEmployees}
                  onChange={handleChange}
                  placeholder="Enter number of employees"
                  min="0"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="annualRevenue">
              <Form.Label column sm={4}>
                Annual Revenue
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="number"
                  name="annualRevenue"
                  value={clientData.annualRevenue}
                  onChange={handleChange}
                  placeholder="Enter annual revenue"
                  min="0"
                />
              </Col>
            </Form.Group>
          </>
        );
      case 4:
        return (
          <>
            <Form.Group as={Row} className="mb-3" controlId="servicesRequested">
              <Form.Label column sm={4}>
                Services Requested<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Check
                  type="checkbox"
                  label="Onsite"
                  name="servicesRequestedOnsite"
                  checked={clientData.servicesRequestedOnsite}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Offsite"
                  name="servicesRequestedOffsite"
                  checked={clientData.servicesRequestedOffsite}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Home Collection"
                  name="servicesRequestedHomecollection"
                  checked={clientData.servicesRequestedHomecollection}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="preferredServiceTimes"
            >
              <Form.Label column sm={4}>
                Preferred Service Times<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="preferredServiceTimes"
                  value={clientData.preferredServiceTimes}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Weekdays 9am-5pm"
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="specialRequirements"
            >
              <Form.Label column sm={4}>
                Special Requirements
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="specialRequirements"
                  value={clientData.specialRequirements}
                  onChange={handleChange}
                  placeholder="Enter any special requirements"
                />
              </Col>
            </Form.Group>
          </>
        );
      case 5:
        return (
          <>
            <Form.Group as={Row} className="mb-3" controlId="contactPersonName">
              <Form.Label column sm={4}>
                Contact Person Name<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="contactPersonName"
                  value={clientData.contactPersonName}
                  onChange={handleChange}
                  required
                  placeholder="Enter contact person name"
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="contactPersonDesignation"
            >
              <Form.Label column sm={4}>
                Contact Person Designation
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="contactPersonDesignation"
                  value={clientData.contactPersonDesignation}
                  onChange={handleChange}
                  required
                  placeholder="Enter designation"
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="contactPersonPhoneNumber"
            >
              <Form.Label column sm={4}>
                Contact Person Phone<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="tel"
                  name="contactPersonPhoneNumber"
                  value={clientData.contactPersonPhoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="contactPersonEmail"
            >
              <Form.Label column sm={4}>
                Contact Person Email<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="email"
                  name="contactPersonEmail"
                  value={clientData.contactPersonEmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                />
              </Col>
            </Form.Group>
          </>
        );
      case 6:
        return (
          <>
            <Form.Group as={Row} className="mb-3" controlId="certifications">
              <Form.Label column sm={4}>
                Certifications
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="certifications"
                  value={clientData.certifications}
                  onChange={handleChange}
                  placeholder="Enter certifications"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="billingAddress">
              <Form.Label column sm={4}>
                Billing Address
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="billingAddress"
                  value={clientData.billingAddress}
                  onChange={handleChange}
                  placeholder="Enter billing address"
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="preferredPaymentMethods"
            >
              <Form.Label column sm={4}>
                Preferred Payment Methods
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="preferredPaymentMethods"
                  value={clientData.preferredPaymentMethods}
                  onChange={handleChange}
                  placeholder="e.g., Credit Card, Bank Transfer"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="creditTerms">
              <Form.Label column sm={4}>
                Credit Terms
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="creditTerms"
                  value={clientData.creditTerms}
                  onChange={handleChange}
                  placeholder="Enter credit terms"
                />
              </Col>
            </Form.Group>
          </>
        );
      case 7:
        return (
          <>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="communicationChannels"
            >
              <Form.Label column sm={4}>
                Communication Channels
              </Form.Label>
              <Col sm={8}>
                <Form.Check
                  type="checkbox"
                  label="Email"
                  name="communicationChannels"
                  value="Email"
                  checked={clientData.communicationChannels.includes("Email")}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Phone"
                  name="communicationChannels"
                  value="Phone"
                  checked={clientData.communicationChannels.includes("Phone")}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="SMS"
                  name="communicationChannels"
                  value="SMS"
                  checked={clientData.communicationChannels.includes("SMS")}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="integrationRequirements"
            >
              <Form.Label column sm={4}>
                Integration Requirements
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="integrationRequirements"
                  value={clientData.integrationRequirements}
                  onChange={handleChange}
                  placeholder="Enter integration requirements"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="notes">
              <Form.Label column sm={4}>
                Notes
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={clientData.notes}
                  onChange={handleChange}
                  placeholder="Enter any notes"
                />
              </Col>
            </Form.Group>
          </>
        );
      case 8:
        return (
          <>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="complianceCertifications"
            >
              <Form.Label column sm={4}>
                Compliance Certifications
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="complianceCertifications"
                  value={clientData.complianceCertifications}
                  onChange={handleChange}
                  placeholder="Enter compliance certifications"
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="dataIntegrationDetails"
            >
              <Form.Label column sm={4}>
                Data Integration Details
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="dataIntegrationDetails"
                  value={clientData.dataIntegrationDetails}
                  onChange={handleChange}
                  placeholder="Enter data integration details"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="slaDetails">
              <Form.Label column sm={4}>
                SLA Details
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="slaDetails"
                  value={clientData.slaDetails}
                  onChange={handleChange}
                  placeholder="Enter SLA details"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="insuranceDetails">
              <Form.Label column sm={4}>
                Insurance Details
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="insuranceDetails"
                  value={clientData.insuranceDetails}
                  onChange={handleChange}
                  placeholder="Enter insurance details"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="consentAgreements">
              <Form.Label column sm={4}>
                Consent Agreements
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="consentAgreements"
                  value={clientData.consentAgreements}
                  onChange={handleChange}
                  placeholder="Enter consent agreements"
                />
              </Col>
            </Form.Group>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {!isEditMode && (
        <Button variant="primary" onClick={() => setShow(true)}>
          Add New Client
        </Button>
      )}

      <Modal show={show} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Edit Client" : "Add New Client"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>{renderStep()}</Form>
        </Modal.Body>
        <Modal.Footer>
          {currentStep > 1 && (
            <Button variant="secondary" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {currentStep < 8 ? (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              variant={isEditMode ? "warning" : "success"}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update"
                : "Submit"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ClientForm;
