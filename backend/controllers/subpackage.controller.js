const { db } = require("../config/db.config");

exports.getSubpackagesByPackage = (req, res) => {
  const { packageId } = req.params;

  const query = "SELECT * FROM subpackages WHERE package_id = ?";
  db.query(query, [packageId], (err, results) => {
    if (err) {
      console.error("Error fetching subpackages:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    res.json(results);
  });
};

exports.getSubpackageById = (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM subpackages WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching subpackage:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Subpackage not found" });
    }
    res.json(results[0]);
  });
};

exports.createSubpackage = (req, res) => {
  const { package_id, name, description } = req.body;
  if (!package_id || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newSubpackage = {
    package_id,
    name,
    description: description || null,
  };
  const query = "INSERT INTO subpackages SET ?";
  db.query(query, newSubpackage, (err, result) => {
    if (err) {
      console.error("Error creating subpackage:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    res.status(201).json({
      message: "Subpackage created successfully",
      subpackageId: result.insertId,
    });
  });
};

exports.updateSubpackage = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const updatedSubpackage = {
    name,
    description: description || null,
    updated_at: new Date(),
  };

  const query = "UPDATE subpackages SET ? WHERE id = ?";
  db.query(query, [updatedSubpackage, id], (err, result) => {
    if (err) {
      console.error("Error updating subpackage:", err);
      return res
        .status(500)
        .json({ message: "Server Error", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subpackage not found" });
    }

    const selectQuery =
      "SELECT id, package_id, name, description, created_at, updated_at FROM subpackages WHERE id = ?";
    db.query(selectQuery, [id], (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error fetching updated subpackage:", selectErr);
        return res
          .status(500)
          .json({ message: "Server Error", error: selectErr.message });
      }
      res.json({
        message: "Subpackage updated successfully",
        subpackage: selectResults[0],
      });
    });
  });
};

exports.deleteSubpackage = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM subpackages WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting subpackage:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subpackage not found" });
    }
    res.json({ message: "Subpackage deleted successfully" });
  });
};
