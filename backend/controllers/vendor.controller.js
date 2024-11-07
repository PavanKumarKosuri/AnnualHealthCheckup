const { db } = require("../config/db.config");

const getVendors = (req, res) => {
  const { name, city, serviceType } = req.query;
  let sql = "SELECT * FROM vendors WHERE 1=1";
  const params = [];

  if (name) {
    sql += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (city) {
    sql += " AND city LIKE ?";
    params.push(`%${city}%`);
  }
  if (serviceType) {
    sql += " AND serviceType = ?";
    params.push(serviceType);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error retrieving vendors:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(results);
  });
};

const addVendor = (req, res) => {
  const {
    name,
    phoneNumber,
    email,
    address,
    city,
    serviceType,
    testingCapacity,
    turnaroundTime,
    accreditations,
    phlebotomistCount,
  } = req.body;
  const sql =
    "INSERT INTO vendors (name, phoneNumber, email, address, city, serviceType, testingCapacity, turnaroundTime, accreditations, phlebotomistCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const params = [
    name,
    phoneNumber,
    email,
    address,
    city,
    serviceType,
    testingCapacity,
    turnaroundTime,
    accreditations,
    phlebotomistCount,
  ];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error adding vendor:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(201).json({ id: results.insertId });
  });
};

const updateVendor = (req, res) => {
  const { id } = req.params;
  const {
    name,
    phoneNumber,
    email,
    address,
    city,
    serviceType,
    testingCapacity,
    turnaroundTime,
    accreditations,
    phlebotomistCount,
  } = req.body;
  const sql =
    "UPDATE vendors SET name = ?, phoneNumber = ?, email = ?, address = ?, city = ?, serviceType = ?, testingCapacity = ?, turnaroundTime = ?, accreditations = ?, phlebotomistCount = ? WHERE id = ?";
  const params = [
    name,
    phoneNumber,
    email,
    address,
    city,
    serviceType,
    testingCapacity,
    turnaroundTime,
    accreditations,
    phlebotomistCount,
    id,
  ];

  db.query(sql, params, (err) => {
    if (err) {
      console.error("Error updating vendor:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({ message: "Vendor updated successfully" });
  });
};

const deleteVendor = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM vendors WHERE id = ?";
  const params = [id];

  db.query(sql, params, (err) => {
    if (err) {
      console.error("Error deleting vendor:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({ message: "Vendor deleted successfully" });
  });
};

const getVendorsByCity = (req, res) => {
  const { city } = req.params;
  const sql = "SELECT * FROM vendors WHERE city = ?";
  const params = [city];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error retrieving vendors by city:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(results);
  });
};

module.exports = {
  getVendors,
  getVendorsByCity,
  addVendor,
  updateVendor,
  deleteVendor,
};
