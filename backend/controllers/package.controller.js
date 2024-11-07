const { db } = require("../config/db.config");

exports.getPackagesByClient = (req, res) => {
  const { clientId } = req.params;
  const query = "SELECT * FROM packages WHERE client_id = ?";
  db.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching packages:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    res.json(results);
  });
};

exports.getPackageById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM packages WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching package:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(results[0]);
  });
};

exports.createPackage = (req, res) => {
  const { client_id, name, description } = req.body;
  if (!client_id || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newPackage = {
    client_id,
    name,
    description: description || null,
  };

  const query = "INSERT INTO packages SET ?";
  db.query(query, newPackage, (err, result) => {
    if (err) {
      console.error("Error creating package:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    res.status(201).json({
      message: "Package created successfully",
      packageId: result.insertId,
    });
  });
};

exports.updatePackage = (req, res) => {
  const { id } = req.params;
  const { name, description, client_id } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const updatedPackage = {
    name,
    description: description || null,
    updated_at: new Date(),
  };

  if (client_id) {
    updatedPackage.client_id = client_id;
  }

  const query = "UPDATE packages SET ? WHERE id = ?";
  db.query(query, [updatedPackage, id], (err, result) => {
    if (err) {
      console.error("Error updating package:", err);
      return res
        .status(500)
        .json({ message: "Server Error", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    const selectQuery =
      "SELECT id, client_id, name, description, created_at, updated_at FROM packages WHERE id = ?";
    db.query(selectQuery, [id], (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error fetching updated package:", selectErr);
        return res
          .status(500)
          .json({ message: "Server Error", error: selectErr.message });
      }
      res.json({
        message: "Package updated successfully",
        package: selectResults[0],
      });
    });
  });
};

exports.deletePackage = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM packages WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting package:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json({ message: "Package deleted successfully" });
  });
};
