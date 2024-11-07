const { db } = require("../config/db.config");
const { v4: uuidv4 } = require("uuid");

const generateClientId = () => {
  return `CLT-${uuidv4().slice(0, 8).toUpperCase()}`;
};

const parseCommunicationChannels = (channels) => {
  if (!channels) return [];
  return channels.split(",").map((channel) => channel.trim());
};

const stringifyCommunicationChannels = (channels) => {
  if (!channels || !Array.isArray(channels)) return "";
  return channels.join(", ");
};

exports.getClients = (req, res) => {
  const query = `
    SELECT 
      id, 
      client_id,
      name, 
      email, 
      phone_number, 
      address, 
      city, 
      state, 
      zip_code, 
      country, 
      registration_number, 
      tax_id, 
      industry_type, 
      number_of_employees, 
      annual_revenue, 
      CAST(services_requested_onsite AS SIGNED) AS services_requested_onsite,
      CAST(services_requested_offsite AS SIGNED) AS services_requested_offsite,
      CAST(services_requested_homecollection AS SIGNED) AS services_requested_homecollection,
      preferred_service_times, 
      special_requirements, 
      contact_person_name, 
      contact_person_designation, 
      contact_person_phone_number, 
      contact_person_email, 
      certifications, 
      billing_address, 
      preferred_payment_methods, 
      credit_terms, 
      communication_channels, 
      integration_requirements, 
      notes, 
      compliance_certifications, 
      data_integration_details, 
      sla_details, 
      insurance_details, 
      consent_agreements
    FROM clients
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching clients:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    res.json(results);
  });
};

exports.getClientById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM clients WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching client:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(results[0]);
  });
};

exports.getClientByClientId = (req, res) => {
  const { client_id } = req.params;
  const query = "SELECT * FROM clients WHERE client_id = ?";
  db.query(query, [client_id], (err, results) => {
    if (err) {
      console.error("Error fetching client:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(results[0]);
  });
};

exports.createClient = (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    address,
    city,
    state,
    zipCode,
    country,
    registrationNumber,
    taxId,
    industryType,
    numberOfEmployees,
    annualRevenue,
    servicesRequestedOnsite,
    servicesRequestedOffsite,
    servicesRequestedHomecollection,
    preferredServiceTimes,
    specialRequirements,
    contactPersonName,
    contactPersonDesignation,
    contactPersonPhoneNumber,
    contactPersonEmail,
    certifications,
    billingAddress,
    preferredPaymentMethods,
    creditTerms,
    communicationChannels,
    integrationRequirements,
    notes,
    complianceCertifications,
    dataIntegrationDetails,
    slaDetails,
    insuranceDetails,
    consentAgreements,
  } = req.body;

  if (!name || !email || !contactPersonName || !contactPersonEmail) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const clientId = generateClientId();
  const newClient = {
    id: uuidv4(),
    client_id: clientId,
    name,
    email,
    phone_number: phoneNumber || null,
    address: address || null,
    city: city || null,
    state: state || null,
    zip_code: zipCode || null,
    country: country || null,
    registration_number: registrationNumber || null,
    tax_id: taxId || null,
    industry_type: industryType || null,
    number_of_employees: numberOfEmployees || null,
    annual_revenue: annualRevenue || null,
    services_requested_onsite: servicesRequestedOnsite ? 1 : 0,
    services_requested_offsite: servicesRequestedOffsite ? 1 : 0,
    services_requested_homecollection: servicesRequestedHomecollection ? 1 : 0,
    preferred_service_times: preferredServiceTimes || null,
    special_requirements: specialRequirements || null,
    contact_person_name: contactPersonName || null,
    contact_person_designation: contactPersonDesignation || null,
    contact_person_phone_number: contactPersonPhoneNumber || null,
    contact_person_email: contactPersonEmail || null,
    certifications: certifications || null,
    billing_address: billingAddress || null,
    preferred_payment_methods: preferredPaymentMethods || null,
    credit_terms: creditTerms || null,
    communication_channels: communicationChannels
      ? communicationChannels.join(", ")
      : null,
    integration_requirements: integrationRequirements || null,
    notes: notes || null,
    compliance_certifications: complianceCertifications || null,
    data_integration_details: dataIntegrationDetails || null,
    sla_details: slaDetails || null,
    insurance_details: insuranceDetails || null,
    consent_agreements: consentAgreements || null,
  };

  const query = "INSERT INTO clients SET ?";
  db.query(query, newClient, (err, result) => {
    if (err) {
      console.error("Error creating client:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    res.status(201).json({
      message: "Client created successfully",
      client: { ...newClient },
    });
  });
};

exports.updateClient = (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  const fieldMapping = {
    phoneNumber: "phone_number",
    zipCode: "zip_code",
    registrationNumber: "registration_number",
    taxId: "tax_id",
    industryType: "industry_type",
    numberOfEmployees: "number_of_employees",
    annualRevenue: "annual_revenue",
    servicesRequestedOnsite: "services_requested_onsite",
    servicesRequestedOffsite: "services_requested_offsite",
    servicesRequestedHomecollection: "services_requested_homecollection",
    preferredServiceTimes: "preferred_service_times",
    specialRequirements: "special_requirements",
    contactPersonName: "contact_person_name",
    contactPersonDesignation: "contact_person_designation",
    contactPersonPhoneNumber: "contact_person_phone_number",
    contactPersonEmail: "contact_person_email",
    billingAddress: "billing_address",
    preferredPaymentMethods: "preferred_payment_methods",
    creditTerms: "credit_terms",
    communicationChannels: "communication_channels",
    integrationRequirements: "integration_requirements",
    complianceCertifications: "compliance_certifications",
    dataIntegrationDetails: "data_integration_details",
    slaDetails: "sla_details",
    insuranceDetails: "insurance_details",
    consentAgreements: "consent_agreements",
  };

  const mappedFields = {};
  for (const [key, value] of Object.entries(updatedFields)) {
    const mappedKey = fieldMapping[key] || key;
    if (key === "communicationChannels" && Array.isArray(value)) {
      mappedFields[mappedKey] = value.length > 0 ? value.join(", ") : null;
    } else {
      mappedFields[mappedKey] = value;
    }
  }

  // Convert boolean fields to integers
  [
    "services_requested_onsite",
    "services_requested_offsite",
    "services_requested_homecollection",
  ].forEach((field) => {
    if (field in mappedFields) {
      mappedFields[field] = mappedFields[field] ? 1 : 0;
    }
  });


  const query = "UPDATE clients SET ? WHERE id = ?";
  db.query(query, [mappedFields, id], (err, result) => {
    if (err) {
      console.error("Error updating client:", err);
      return res
        .status(500)
        .json({ message: "Server Error", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    const selectQuery = "SELECT * FROM clients WHERE id = ?";
    db.query(selectQuery, [id], (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error fetching updated client:", selectErr);
        return res
          .status(500)
          .json({ message: "Server Error", error: selectErr.message });
      }
      if (selectResults.length === 0) {
        return res.status(404).json({ message: "Updated client not found" });
      }
      res.json({
        message: "Client updated successfully",
        client: selectResults[0],
      });
    });
  });
};

exports.deleteClient = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM clients WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting client:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json({ message: "Client deleted successfully" });
  });
};
