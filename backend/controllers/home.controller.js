const { db } = require("../config/db.config");

const createHomeCollection = (req, res) => {
  const {
    userId,
    streetAddress,
    cityAddress,
    stateAddress,
    zipCode,
    landmark,
    scheduledDate,
    scheduledTime,
    preferredVendor,
    preferredLanguage,
    dependents_count,
  } = req.body;

  const sql = `
    INSERT INTO home_collections 
    (user_id, streetAddress, cityAddress, stateAddress, zipCode, landmark, scheduledDate, scheduledTime, preferredVendor, preferredLanguage, dependents_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    userId,
    streetAddress,
    cityAddress,
    stateAddress,
    zipCode,
    landmark || null,
    scheduledDate,
    scheduledTime,
    preferredVendor,
    preferredLanguage || null,
    dependents_count || 0,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error creating Home collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(201).json({
      message: "Home collection created successfully.",
      homeCollectionId: result.insertId,
    });
  });
};

const getAllHomeCollections = (req, res) => {
  const sql = `
    SELECT 
      hc.*, 
      u.patientName, 
      u.phoneNumber, 
      u.timeslot
    FROM home_collections hc
    JOIN users u ON hc.user_id = u.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving Home collections:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(results);
  });
};

const getHomeCollectionById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      hc.*, 
      u.patientName, 
      u.phoneNumber, 
      u.timeslot
    FROM home_collections hc
    JOIN users u ON hc.user_id = u.id
    WHERE hc.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error retrieving Home collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Home collection not found." });
    }

    res.status(200).json(results[0]);
  });
};

const updateHomeCollection = (req, res) => {
  const { user_id } = req.params;
  const {
    streetAddress,
    cityAddress,
    stateAddress,
    zipCode,
    landmark,
    scheduledDate,
    scheduledTime,
    preferredVendor,
    preferredLanguage,
    dependents_count,
  } = req.body;

  let sql = "UPDATE home_collections SET ";
  const fields = [];
  const params = [];

  if (streetAddress !== undefined) {
    fields.push("streetAddress = ?");
    params.push(streetAddress);
  }
  if (cityAddress !== undefined) {
    fields.push("cityAddress = ?");
    params.push(cityAddress);
  }
  if (stateAddress !== undefined) {
    fields.push("stateAddress = ?");
    params.push(stateAddress);
  }
  if (zipCode !== undefined) {
    fields.push("zipCode = ?");
    params.push(zipCode);
  }
  if (landmark !== undefined) {
    fields.push("landmark = ?");
    params.push(landmark);
  }
  if (scheduledDate !== undefined) {
    fields.push("scheduledDate = ?");
    params.push(scheduledDate);
  }
  if (scheduledTime !== undefined) {
    fields.push("scheduledTime = ?");
    params.push(scheduledTime);
  }
  if (preferredVendor !== undefined) {
    fields.push("preferredVendor = ?");
    params.push(preferredVendor);
  }
  if (preferredLanguage !== undefined) {
    fields.push("preferredLanguage = ?");
    params.push(preferredLanguage);
  }
  if (dependents_count !== undefined) {
    fields.push("dependents_count = ?");
    params.push(dependents_count);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  sql += fields.join(", ") + " WHERE user_id = ?";
  params.push(user_id);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating Home collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Home collection not found." });
    }

    res.status(200).json({ message: "Home collection updated successfully." });
  });
};

const deleteHomeCollection = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM home_collections WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting Home collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Home collection not found." });
    }

    res.status(200).json({ message: "Home collection deleted successfully." });
  });
};

module.exports = {
  createHomeCollection,
  getAllHomeCollections,
  getHomeCollectionById,
  updateHomeCollection,
  deleteHomeCollection,
};
