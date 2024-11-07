const { db } = require("../config/db.config");

// Function to create a new Offsite Location
const createOffsiteLocation = (req, res) => {
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
    INSERT INTO offsite_locations 
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
      console.error("Error creating offsite location:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(201).json({
      message: "Offsite location created successfully.",
      offsiteLocationId: result.insertId,
    });
  });
};

// Function to get all Offsite Locations
const getAllOffsiteLocations = (req, res) => {
  const sql = "SELECT * FROM offsite_locations";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving offsite locations:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(results);
  });
};

// Function to get a specific Offsite Location by ID
const getOffsiteLocationById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM offsite_locations WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error retrieving offsite location:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Offsite location not found." });
    }

    res.status(200).json(results[0]);
  });
};

// Function to update an Offsite Location by ID
const updateOffsiteLocation = (req, res) => {
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
    UPDATE offsite_locations 
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
      console.error("Error updating offsite location:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Offsite location not found." });
    }

    res.status(200).json({ message: "Offsite location updated successfully." });
  });
};

// Function to delete an Offsite Location by ID
const deleteOffsiteLocation = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM offsite_locations WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting offsite location:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Offsite location not found." });
    }

    res.status(200).json({ message: "Offsite location deleted successfully." });
  });
};

module.exports = {
  createOffsiteLocation,
  getAllOffsiteLocations,
  getOffsiteLocationById,
  updateOffsiteLocation,
  deleteOffsiteLocation,
};
