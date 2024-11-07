const { db } = require("../config/db.config");

const createOnsiteCollection = (req, res) => {
  const { userId, scheduledDate, scheduledTime } = req.body;

  const sql = `
    INSERT INTO onsite_collections 
    (user_id, scheduledDate, scheduledTime)
    VALUES (?, ?, ?)
  `;
  const params = [userId, scheduledDate, scheduledTime];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error creating Onsite collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(201).json({
      message: "Onsite collection created successfully.",
      onsiteCollectionId: result.insertId,
    });
  });
};

const getAllOnsiteCollections = (req, res) => {
  const sql = `
    SELECT oc.*, u.patientName, u.phoneNumber
    FROM onsite_collections oc
    JOIN users u ON oc.user_id = u.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving Onsite collections:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(results);
  });
};

const getOnsiteCollectionById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT oc.*, u.patientName, u.phoneNumber
    FROM onsite_collections oc
    JOIN users u ON oc.user_id = u.id
    WHERE oc.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error retrieving Onsite collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Onsite collection not found." });
    }

    res.status(200).json(results[0]);
  });
};

const updateOnsiteCollection = (req, res) => {
  const { id } = req.params;
  const { scheduledDate, scheduledTime } = req.body;

  const sql = `
    UPDATE onsite_collections 
    SET scheduledDate = ?, scheduledTime = ?
    WHERE user_id = ?
  `;
  const params = [scheduledDate, scheduledTime, id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating Onsite collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Onsite collection not found." });
    }

    res
      .status(200)
      .json({ message: "Onsite collection updated successfully." });
  });
};

const deleteOnsiteCollection = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM onsite_collections WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting Onsite collection:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Onsite collection not found." });
    }

    res
      .status(200)
      .json({ message: "Onsite collection deleted successfully." });
  });
};

module.exports = {
  createOnsiteCollection,
  getAllOnsiteCollections,
  getOnsiteCollectionById,
  updateOnsiteCollection,
  deleteOnsiteCollection,
};
