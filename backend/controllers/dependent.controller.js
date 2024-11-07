const { db } = require("../config/db.config");

const addDependent = (req, res) => {
  const {
    user_id,
    name,
    age,
    relationship,
    gender,
    package,
    subPackage,
    bookingId,
  } = req.body;

  if (
    !user_id ||
    !name ||
    !age ||
    !relationship ||
    !gender ||
    !package ||
    !bookingId
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO dependents
    (user_id, name, age, relationship, gender, package, subPackage, bookingId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    user_id,
    name,
    age,
    relationship,
    gender,
    package,
    subPackage || null,
    bookingId,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error adding dependent:", err);
      return res.status(500).json({
        error: "Internal Server Error",
        details: err.message,
        code: err.code,
        sqlMessage: err.sqlMessage,
        sqlState: err.sqlState,
      });
    }
    res.status(201).json({
      message: "Dependent added successfully.",
      dependentId: result.insertId,
    });
  });
};

const getDependentsByUserId = (req, res) => {
  const { userId } = req.params;

  const sql = "SELECT * FROM dependents WHERE user_id = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error retrieving dependents:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(results);
  });
};

const updateDependent = (req, res) => {
  const { dependentId } = req.params;
  const { name, age, relationship, gender, package, subPackage, bookingId } =
    req.body;

  if (
    !name &&
    !age &&
    !relationship &&
    !gender &&
    !package &&
    subPackage === undefined &&
    !bookingId
  ) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update." });
  }

  let sql = "UPDATE dependents SET ";
  const params = [];

  if (name !== undefined) {
    sql += "name = ?, ";
    params.push(name);
  }
  if (age !== undefined) {
    sql += "age = ?, ";
    params.push(age);
  }
  if (relationship !== undefined) {
    sql += "relationship = ?, ";
    params.push(relationship);
  }
  if (gender !== undefined) {
    sql += "gender = ?, ";
    params.push(gender);
  }
  if (package !== undefined) {
    sql += "`package` = ?, ";
    params.push(package);
  }
  if (subPackage !== undefined) {
    sql += "subPackage = ?, ";
    params.push(subPackage);
  }
  if (bookingId !== undefined) {
    sql += "bookingId = ?, ";
    params.push(bookingId);
  }

  sql = sql.slice(0, -2);

  sql += " WHERE id = ?";
  params.push(dependentId);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating dependent:", err);
      return res.status(500).json({
        error: "Internal Server Error",
        details: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Dependent not found." });
    }

    res.status(200).json({
      message: "Dependent updated successfully.",
    });
  });
};

const deleteDependent = (req, res) => {
  const { dependentId } = req.params;

  const sql = "DELETE FROM dependents WHERE id = ?";

  db.query(sql, [dependentId], (err, result) => {
    if (err) {
      console.error("Error deleting dependent:", err);
      return res.status(500).json({
        error: "Internal Server Error",
        details: err.message,
        code: err.code,
        sqlMessage: err.sqlMessage,
        sqlState: err.sqlState,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Dependent not found." });
    }

    res.status(200).json({
      message: "Dependent deleted successfully.",
    });
  });
};

const getDependentsByEmployeeId = (req, res) => {
  const { employeeId } = req.params;

  const sql = `
    SELECT d.*
    FROM dependents d
    JOIN users u ON d.user_id = u.id
    WHERE u.employee_id = ?
  `;

  db.query(sql, [employeeId], (err, results) => {
    if (err) {
      console.error("Error retrieving dependents:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(results);
  });
};

module.exports = {
  addDependent,
  getDependentsByUserId,
  getDependentsByEmployeeId,
  deleteDependent,
  updateDependent,
};
