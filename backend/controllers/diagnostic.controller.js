const { db } = require("../config/db.config");

const createDiagnosticCenter = (req, res) => {
  const {
    name,
    address,
    city,
    state,
    zipCode,
    landmark,
    contactNumber,
    longitude,
    latitude,
  } = req.body;

  const sql = `
    INSERT INTO diagnostic_centers 
    (name, address, city, state, zipCode, landmark, contactNumber, longitude, latitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    name,
    address,
    city,
    state,
    zipCode,
    landmark || null,
    contactNumber,
    longitude,
    latitude,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error creating diagnostic center:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(201).json({
      message: "Diagnostic center created successfully.",
      diagnosticCenterId: result.insertId,
    });
  });
};

// Function to get all Diagnostic Centers
const getAllDiagnosticCenters = (req, res) => {
  const sql = "SELECT * FROM diagnostic_centers";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving diagnostic centers:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(results);
  });
};

// Function to get a specific Diagnostic Center by ID
const getDiagnosticCenterById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM diagnostic_centers WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error retrieving diagnostic center:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Diagnostic center not found." });
    }

    res.status(200).json(results[0]);
  });
};

// Function to get Diagnostic Centers by Location ID
const getDiagnosticCentersByLocationId = (req, res) => {
  const { locationId } = req.params;

  const sql = "SELECT * FROM diagnostic_centers WHERE location_id = ?";

  db.query(sql, [locationId], (err, results) => {
    if (err) {
      console.error("Error retrieving diagnostic centers:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "No diagnostic centers found for the selected location.",
      });
    }

    res.status(200).json(results);
  });
};

// Function to update a Diagnostic Center by ID
const updateDiagnosticCenter = (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    city,
    state,
    zipCode,
    landmark,
    contactNumber,
    longitude,
    latitude,
  } = req.body;

  const sql = `
    UPDATE diagnostic_centers 
    SET name = ?, address = ?, city = ?, state = ?, zipCode = ?, landmark = ?, contactNumber = ?, longitude = ?, latitude = ?
    WHERE id = ?
  `;
  const params = [
    name,
    address,
    city,
    state,
    zipCode,
    landmark || null,
    contactNumber,
    longitude,
    latitude,
    id,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating diagnostic center:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Diagnostic center not found." });
    }

    res
      .status(200)
      .json({ message: "Diagnostic center updated successfully." });
  });
};

// Function to delete a Diagnostic Center by ID
const deleteDiagnosticCenter = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM diagnostic_centers WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting diagnostic center:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Diagnostic center not found." });
    }

    res
      .status(200)
      .json({ message: "Diagnostic center deleted successfully." });
  });
};

module.exports = {
  createDiagnosticCenter,
  getAllDiagnosticCenters,
  getDiagnosticCenterById,
  updateDiagnosticCenter,
  deleteDiagnosticCenter,
  getDiagnosticCentersByLocationId,
};
