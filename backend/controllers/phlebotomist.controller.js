// backend/controllers/phlebotomist.controller.js

const { db } = require("../config/db.config");
const { Parser } = require("json2csv"); // Ensure json2csv is installed

// Register a new Phlebotomist
const registerPhlebotomist = (req, res) => {
  const { name, uniqueId, phoneNumber, email, age, gender, city, company } =
    req.body;

  // Basic validation
  if (!name || !uniqueId || !phoneNumber) {
    return res
      .status(400)
      .json({ error: "Name, Unique ID, and Phone Number are required." });
  }

  const checkSql =
    "SELECT id FROM phlebotomists WHERE uniqueId = ? OR phoneNumber = ?";
  db.query(checkSql, [uniqueId, phoneNumber], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking duplicates:", checkErr);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({
        error:
          "Phlebotomist with given Unique ID or Phone Number already exists.",
      });
    }

    const insertSql = `
      INSERT INTO phlebotomists (name, uniqueId, phoneNumber, email, age, gender, city, company)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insertSql,
      [name, uniqueId, phoneNumber, email, age, gender, city, company],
      (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Error registering phlebotomist:", insertErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({
          message: "Phlebotomist registered successfully.",
          phlebotomistId: insertResult.insertId,
        });
      }
    );
  });
};

// Get all Phlebotomists
const getAllPhlebotomists = (req, res) => {
  const sql = "SELECT * FROM phlebotomists";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching phlebotomists:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
};

// Get Phlebotomist Details
const getPhlebotomistDetails = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM phlebotomists WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching phlebotomist details:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Phlebotomist not found." });
    }
    res.status(200).json(results[0]);
  });
};

// Assign Phlebotomist to Client
const assignPhlebotomist = (req, res) => {
  const { id } = req.params;
  const { client_id, start_date, end_date } = req.body;

  // Validate inputs
  if (!client_id || !start_date || !end_date) {
    return res
      .status(400)
      .json({ error: "Client ID, Start Date, and End Date are required." });
  }

  if (new Date(start_date) > new Date(end_date)) {
    return res
      .status(400)
      .json({ error: "Start Date cannot be after End Date." });
  }

  // Check if phlebotomist exists and is free
  const checkSql = "SELECT status FROM phlebotomists WHERE id = ?";
  db.query(checkSql, [id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking phlebotomist status:", checkErr);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ error: "Phlebotomist not found." });
    }

    if (checkResult[0].status === "assigned") {
      return res
        .status(400)
        .json({ error: "Phlebotomist is already assigned." });
    }

    // Assign phlebotomist
    const assignSql = `
      INSERT INTO assignments (phlebotomist_id, client_id, start_date, end_date)
      VALUES (?, ?, ?, ?)
    `;
    db.query(
      assignSql,
      [id, client_id, start_date, end_date],
      (assignErr, assignResult) => {
        if (assignErr) {
          console.error("Error assigning phlebotomist:", assignErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Update phlebotomist status to 'assigned'
        const updateStatusSql =
          "UPDATE phlebotomists SET status = 'assigned' WHERE id = ?";
        db.query(updateStatusSql, [id], (updateErr) => {
          if (updateErr) {
            console.error("Error updating phlebotomist status:", updateErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          res.status(200).json({
            message: "Phlebotomist assigned successfully.",
            assignmentId: assignResult.insertId,
          });
        });
      }
    );
  });
};

// Unassign Phlebotomist
const unassignPhlebotomist = (req, res) => {
  const { id } = req.params;

  // Check if phlebotomist is assigned
  const checkSql = "SELECT status FROM phlebotomists WHERE id = ?";
  db.query(checkSql, [id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking phlebotomist status:", checkErr);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ error: "Phlebotomist not found." });
    }

    if (checkResult[0].status === "free") {
      return res.status(400).json({ error: "Phlebotomist is already free." });
    }

    // Find the active assignment
    const findAssignmentSql = `
      SELECT id FROM assignments
      WHERE phlebotomist_id = ? AND end_date >= CURDATE()
      ORDER BY end_date DESC LIMIT 1
    `;
    db.query(findAssignmentSql, [id], (findErr, findResult) => {
      if (findErr) {
        console.error("Error finding active assignment:", findErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (findResult.length === 0) {
        return res.status(400).json({ error: "No active assignment found." });
      }

      const assignmentId = findResult[0].id;

      // Update assignment end_date to today
      const updateAssignmentSql =
        "UPDATE assignments SET end_date = CURDATE() WHERE id = ?";
      db.query(updateAssignmentSql, [assignmentId], (updateErr) => {
        if (updateErr) {
          console.error("Error updating assignment:", updateErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Update phlebotomist status to 'free'
        const updateStatusSql =
          "UPDATE phlebotomists SET status = 'free' WHERE id = ?";
        db.query(updateStatusSql, [id], (statusErr) => {
          if (statusErr) {
            console.error("Error updating phlebotomist status:", statusErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          res
            .status(200)
            .json({ message: "Phlebotomist unassigned successfully." });
        });
      });
    });
  });
};

// Get Assignments for a Phlebotomist
const getPhlebotomistAssignments = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT a.id, a.client_id, c.name as client_name, a.start_date, a.end_date
    FROM assignments a
    JOIN clients c ON a.client_id = c.id
    WHERE a.phlebotomist_id = ?
    ORDER BY a.start_date DESC
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching assignments:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
};

// Get Phlebotomist Performance
const getPhlebotomistPerformance = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      COUNT(DISTINCT bc.user_id) AS total_tests,
      COUNT(DISTINCT mc.id) AS medical_camps_assigned
    FROM blood_collections bc
    LEFT JOIN medical_camps mc ON bc.collection_date = mc.date
    WHERE bc.phlebotomist_id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching performance data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If no blood collections found for the phlebotomist
    if (results.length === 0) {
      return res
        .status(200)
        .json({ total_tests: 0, medical_camps_assigned: 0 });
    }

    res.status(200).json(results[0]);
  });
};

// Download Phlebotomist Details as CSV
const downloadPhlebotomistDetails = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT p.*, a.client_id, c.name as client_name, a.start_date, a.end_date
    FROM phlebotomists p
    LEFT JOIN assignments a ON p.id = a.phlebotomist_id
    LEFT JOIN clients c ON a.client_id = c.id
    WHERE p.id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching phlebotomist details for download:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Phlebotomist not found." });
    }

    // Convert results to CSV
    const fields = Object.keys(results[0]);
    const opts = { fields };
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(results);
      res.header("Content-Type", "text/csv");
      res.attachment(`phlebotomist_${id}_details.csv`);
      return res.send(csv);
    } catch (err) {
      console.error("Error converting phlebotomist details to CSV:", err);
      return res.status(500).json({ error: "Error generating CSV." });
    }
  });
};

module.exports = {
  registerPhlebotomist,
  getAllPhlebotomists,
  getPhlebotomistDetails,
  assignPhlebotomist,
  unassignPhlebotomist,
  getPhlebotomistAssignments,
  getPhlebotomistPerformance,
  downloadPhlebotomistDetails,
};
