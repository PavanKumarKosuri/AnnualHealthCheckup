const { db } = require("../config/db.config");

const createOffsiteCollection = (req, res) => {
  const {
    userId,
    offsiteLocationId,
    diagnosticCenterId,
    dependents_count,
    scheduledDate,
    scheduledTime,
  } = req.body;

  const dependentsSql =
    "SELECT COUNT(*) AS dependentsCount FROM dependents WHERE user_id = ?";

  db.query(dependentsSql, [userId], (err, results) => {
    if (err) {
      console.error("Error counting dependents:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const sql = `
      INSERT INTO offsite_collections 
      (user_id, offsite_location_id, diagnostic_center_id, dependents_count, scheduledDate, scheduledTime)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      userId,
      offsiteLocationId,
      diagnosticCenterId,
      dependents_count,
      scheduledDate,
      scheduledTime,
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error creating Offsite collection:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(201).json({
        message: "Offsite collection created successfully.",
        offsiteCollectionId: result.insertId,
      });
    });
  });
};

const getAllOffsiteCollections = (req, res) => {
  const sql = `
    SELECT osc.*, u.patientName, u.phoneNumber, ol.name AS offsiteLocationName, dc.name AS diagnosticCenterName, osc.dependents_count
    FROM offsite_collections osc
    JOIN users u ON osc.user_id = u.id
    JOIN offsite_locations ol ON osc.offsite_location_id = ol.id
    JOIN diagnostic_centers dc ON osc.diagnostic_center_id = dc.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving Offsite collections:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(results);
  });
};

const getOffsiteCollectionById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT osc.*, u.patientName, u.phoneNumber, ol.name AS offsiteLocationName, dc.name AS diagnosticCenterName
    FROM offsite_collections osc
    JOIN users u ON osc.user_id = u.id
    JOIN offsite_locations ol ON osc.offsite_location_id = ol.id
    JOIN diagnostic_centers dc ON osc.diagnostic_center_id = dc.id
    WHERE osc.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error retrieving Offsite collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Offsite collection not found." });
    }

    res.status(200).json(results[0]);
  });
};

const updateOffsiteCollection = (req, res) => {
  const { id } = req.params;
  const {
    offsiteLocationId,
    diagnosticCenterId,
    dependents_count,
    scheduledDate,
    scheduledTime,
  } = req.body;
  if (dependents_count === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let sql = "UPDATE offsite_collections SET ";
  const params = [];

  if (offsiteLocationId !== undefined) {
    sql += "offsite_location_id = ?, ";
    params.push(offsiteLocationId);
  }
  if (diagnosticCenterId !== undefined) {
    sql += "diagnostic_center_id = ?, ";
    params.push(diagnosticCenterId);
  }
  if (dependents_count !== undefined) {
    sql += "dependents_count = ?, ";
    params.push(dependents_count);
  }
  if (scheduledDate !== undefined) {
    sql += "scheduledDate = ?, ";
    params.push(scheduledDate);
  }
  if (scheduledTime !== undefined) {
    sql += "scheduledTime = ?, ";
    params.push(scheduledTime);
  }

  sql = sql.slice(0, -2) + " WHERE user_id = ?";
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating Offsite collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Offsite collection not found." });
    }

    res
      .status(200)
      .json({ message: "Offsite collection updated successfully." });
  });
};

const deleteOffsiteCollection = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM offsite_collections WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting Offsite collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Offsite collection not found." });
    }

    res
      .status(200)
      .json({ message: "Offsite collection deleted successfully." });
  });
};

module.exports = {
  createOffsiteCollection,
  getAllOffsiteCollections,
  getOffsiteCollectionById,
  updateOffsiteCollection,
  deleteOffsiteCollection,
};
