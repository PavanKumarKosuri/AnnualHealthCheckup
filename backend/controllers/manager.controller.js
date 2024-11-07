const { db } = require("../config/db.config");
const { v4: uuidv4 } = require("uuid");

const uploadExcel = async (req, res) => {
  const data = req.body.data;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  const processedData = [];
  const skippedData = [];
  let processedCount = 0;

  for (const row of data) {
    const { empid, email, name, phonenumber, city, companyname } = row;
    let { uniquekey } = row;

    if (!empid || !email || !name || !phonenumber || !city || !companyname) {
      skippedData.push(row);
      continue;
    }

    if (!uniquekey) {
      uniquekey = uuidv4();
    }

    try {
      const [existing] = await queryPromise(
        "SELECT uniquekey FROM hrdata WHERE empid = ? OR email = ?",
        [empid, email]
      );

      if (existing && existing.uniquekey) {
        skippedData.push({ ...row, uniquekey: existing.uniquekey });
        continue;
      }

      await queryPromise("INSERT INTO hrdata SET ?", {
        empid,
        email,
        name,
        phonenumber,
        city,
        companyname,
        uniquekey,
      });

      processedData.push({ ...row, uniquekey });
      processedCount++;
    } catch (error) {
      console.error("Error processing row:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  res.json({ processedData, skippedData, processedCount });
};

const getAllHrData = (req, res) => {
  const { empid, name, city, companyname } = req.query;
  let query = "SELECT * FROM hrdata WHERE 1=1";
  const params = [];

  if (empid) {
    query += " AND empid = ?";
    params.push(empid);
  }
  if (name) {
    query += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (city) {
    query += " AND city LIKE ?";
    params.push(`%${city}%`);
  }
  if (companyname) {
    query += " AND companyname LIKE ?";
    params.push(`%${companyname}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching HR data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};

const updateHrData = (req, res) => {
  const { id } = req.params;
  const updatedHr = req.body;

  db.query(
    "UPDATE hrdata SET ? WHERE id = ?",
    [updatedHr, id],
    (err, result) => {
      if (err) {
        console.error("Error updating HR data:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "HR data not found" });
      }
      res.json({ message: "HR data updated successfully" });
    }
  );
};

const addHrData = (req, res) => {
  const newHr = req.body;

  db.query("INSERT INTO hrdata SET ?", newHr, (err, result) => {
    if (err) {
      console.error("Error adding HR data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "HR data added successfully", id: result.insertId });
  });
};

const deleteHrData = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM hrdata WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting HR data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "HR data not found" });
    }
    res.json({ message: "HR data deleted successfully" });
  });
};

const getUniqueKey = (req, res) => {
  const { empid, email } = req.query;

  if (!empid || !email) {
    return res.status(400).json({ error: "Missing empid or email parameter" });
  }

  db.query(
    "SELECT uniquekey FROM hrdata WHERE empid = ? AND email = ?",
    [empid, email],
    (err, results) => {
      if (err) {
        console.error("Error fetching unique key:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length > 0) {
        res.json({ uniquekey: results[0].uniquekey });
      } else {
        const uniquekey = uuidv4();
        res.json({ uniquekey });
      }
    }
  );
};

const getLastEntries = (req, res) => {
  const { count } = req.query;

  if (!count) {
    return res.status(400).json({ error: "Missing count parameter" });
  }

  db.query(
    "SELECT * FROM hrdata ORDER BY id DESC LIMIT ?",
    [parseInt(count, 10)],
    (err, results) => {
      if (err) {
        console.error("Error fetching last entries:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.json(results);
    }
  );
};

module.exports = {
  uploadExcel,
  getAllHrData,
  updateHrData,
  addHrData,
  deleteHrData,
  getUniqueKey,
  getLastEntries,
};
