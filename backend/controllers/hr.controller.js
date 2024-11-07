const { db } = require("../config/db.config");
const xlsx = require("xlsx");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const hrLogin = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM hrdata WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }

    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).send("Internal Server Error");
        }

        if (!isMatch) {
          return res.status(401).send("Unauthorized");
        }

        const { client_id, id: hr_id } = user;
        const token = jwt.sign(
          { client_id, hr_id, email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({ accessToken: token, client_id, hr_id });
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  });
};

const changePassword = (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const query = "SELECT * FROM hrdata WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
    } else if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).send("Unauthorized");
        }

        bcrypt.hash(newPassword, 10, (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).send("Internal server error");
          }

          const updateQuery = "UPDATE hrdata SET password = ? WHERE email = ?";
          db.query(updateQuery, [hash, email], (err, result) => {
            if (err) {
              console.error("Error updating password:", err);
              return res.status(500).send("Internal server error");
            }
            res.status(200).send("Password changed successfully");
          });
        });
      });
    } else {
      res.status(404).send("User not found");
    }
  });
};

const uploadEligibleEmployees = async (req, res) => {
  if (!req.file) {
    console.error("No file uploaded.");
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetNameList = workbook.SheetNames;
    const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

    const { client_id, hr_id } = req.params;

    if (!client_id || !hr_id) {
      console.error("Missing client_id or hr_id.");
      return res
        .status(400)
        .json({ error: "client_id and hr_id are required" });
    }

    const validRows = [];
    const invalidRows = [];

    xlData.forEach((row, index) => {
      const { employeeId, email, name, phoneNumber } = row;
      if (employeeId && email && name && phoneNumber) {
        validRows.push(row);
      } else {
        console.warn(`Invalid row at index ${index}:`, row);
        invalidRows.push(row);
      }
    });

    if (validRows.length === 0) {
      return res.status(400).json({
        error: "No valid rows found in the uploaded file.",
        invalidRows,
      });
    }

    // Query existing employees
    const getCurrentDataQuery =
      "SELECT employeeId, email, name, phoneNumber FROM eligibleusers WHERE client_id = ? AND hr_id = ?";

    db.query(getCurrentDataQuery, [client_id, hr_id], (err, currentData) => {
      if (err) {
        console.error("Error fetching current data from MySQL:", err);
        return res.status(500).send("Error fetching current data.");
      }

      const currentDataMap = currentData.reduce((acc, row) => {
        acc[row.employeeId] = row;
        return acc;
      }, {});

      const valuesToUpdate = [];
      const valuesToInsert = [];

      validRows.forEach((row) => {
        const currentRow = currentDataMap[row.employeeId];
        if (currentRow) {
          if (
            currentRow.name !== row.name ||
            currentRow.phoneNumber !== row.phoneNumber ||
            currentRow.email !== row.email
          ) {
            valuesToUpdate.push([
              row.name,
              row.phoneNumber,
              row.email,
              row.employeeId,
              client_id,
              hr_id,
            ]);
          }
        } else {
          valuesToInsert.push([
            row.employeeId,
            row.name,
            row.phoneNumber,
            row.email,
            client_id,
            hr_id,
          ]);
        }
      });

      const successMessages = [];

      if (valuesToInsert.length > 0) {
        const insertQuery = `
          INSERT INTO eligibleusers (employeeId, name, phoneNumber, email, client_id, hr_id) 
          VALUES ?`;

        db.query(insertQuery, [valuesToInsert], (err, result) => {
          if (err) {
            console.error("Error inserting data into MySQL:", err);
            return res.status(500).send("Error uploading data.");
          }
          successMessages.push(
            `${valuesToInsert.length} records inserted successfully.`
          );
          if (valuesToUpdate.length === 0) {
            return res.status(200).json({
              message: successMessages.join(" "),
              invalidRows,
            });
          }

          handleUpdate();
        });
      } else {
        handleUpdate();
      }

      function handleUpdate() {
        if (valuesToUpdate.length > 0) {
          const updatePromises = valuesToUpdate.map((row) => {
            const updateQuery = `
              UPDATE eligibleusers 
              SET name = ?, phoneNumber = ?, email = ?
              WHERE employeeId = ? AND client_id = ? AND hr_id = ?`;

            return new Promise((resolve, reject) => {
              db.query(updateQuery, [...row], (err, result) => {
                if (err) {
                  console.error("Error updating data in MySQL:", err);
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            });
          });

          Promise.all(updatePromises)
            .then(() => {
              successMessages.push(
                `${valuesToUpdate.length} records updated successfully.`
              );
              res.status(200).json({
                message: successMessages.join(" "),
                invalidRows,
              });
            })
            .catch((err) => {
              console.error("Error updating data in MySQL:", err);
              res.status(500).send("Error uploading data.");
            });
        } else {
          res.status(200).json({
            message: successMessages.join(" "),
            invalidRows,
          });
        }
      }
    });
  } catch (error) {
    console.error("Error processing file upload:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllEligibleEmployees = (req, res) => {
  const { client_id, hr_id } = req.params;

  let query = `
    SELECT * 
    FROM eligibleusers 
    WHERE client_id = ? AND hr_id = ?`;

  db.query(query, [client_id, hr_id], (err, results) => {
    if (err) {
      console.error("Error fetching eligible employees:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const updatedResults = results.map((employee) => ({
      ...employee,
      email: employee.email || "NA",
    }));

    res.json(updatedResults);
  });
};

const addEligibleEmployee = (req, res) => {
  const { employeeId, email, name, phoneNumber } = req.body;
  const { client_id, hr_id } = req.body;

  if (!employeeId || !email || !name || !phoneNumber || !client_id || !hr_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const duplicateCheckQuery =
    "SELECT * FROM eligibleusers WHERE (employeeId = ? OR email = ?) AND client_id = ? AND hr_id = ?";

  db.query(
    duplicateCheckQuery,
    [employeeId, email, client_id, hr_id],
    (err, results) => {
      if (err) {
        console.error("Error checking for duplicate eligible employees:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Duplicate entry found" });
      }

      const newEmployee = {
        employeeId,
        email,
        name,
        phoneNumber,
        client_id,
        hr_id,
      };

      db.query(
        "INSERT INTO eligibleusers SET ?",
        newEmployee,
        (err, result) => {
          if (err) {
            console.error("Error adding eligible employee:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          res.json({
            message: "Eligible employee added successfully",
            id: result.insertId,
          });
        }
      );
    }
  );
};

const updateEligibleEmployee = (req, res) => {
  const { id } = req.params;
  const { client_id, hr_id, ...updatedEmployee } = req.body;

  if (!client_id || !hr_id) {
    return res.status(400).json({ error: "Missing client_id or hr_id" });
  }

  const updateQuery = `
    UPDATE eligibleusers 
    SET ? 
    WHERE id = ? AND client_id = ? AND hr_id = ?
  `;

  db.query(
    updateQuery,
    [updatedEmployee, id, client_id, hr_id],
    (err, result) => {
      if (err) {
        console.error("Error updating eligible employee:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Eligible employee not found or not authorized" });
      }

      res.json({ message: "Eligible employee updated successfully" });
    }
  );
};

const deleteEligibleEmployee = (req, res) => {
  const { id } = req.params;
  const { client_id, hr_id } = req.body;

  if (!client_id || !hr_id) {
    return res.status(400).json({ error: "Missing client_id or hr_id" });
  }

  const deleteQuery = `
    DELETE FROM eligibleusers 
    WHERE id = ? AND client_id = ? AND hr_id = ?
  `;

  db.query(deleteQuery, [id, client_id, hr_id], (err, result) => {
    if (err) {
      console.error("Error deleting eligible employee:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Eligible employee not found or not authorized" });
    }

    res.json({ message: "Eligible employee deleted successfully" });
  });
};

const getDashboardMetrics = async (req, res) => {
  const { client_id, hr_id } = req.user;

  try {
    const totalRegisteredQuery = `
      SELECT COUNT(*) AS totalRegistered
      FROM eligibleusers ee
      INNER JOIN users u ON ee.employeeId = u.employee_id
      WHERE ee.client_id = ? AND ee.hr_id = ?`;

    const [totalRegisteredResult] = await queryPromise(totalRegisteredQuery, [
      client_id,
      hr_id,
    ]);

    const unregisteredUsersQuery = `
      SELECT COUNT(*) AS totalUnregistered
      FROM eligibleusers ee
      LEFT JOIN users u ON ee.employeeId = u.employee_id
      WHERE u.employee_id IS NULL AND ee.client_id = ? AND ee.hr_id = ?`;

    const [unregisteredUsersResult] = await queryPromise(
      unregisteredUsersQuery,
      [client_id, hr_id]
    );

    const samplesCollectedQuery = `
      SELECT COUNT(*) AS samplesCollected
      FROM users u
      WHERE u.client_id = ? AND u.hr_id = ? AND u.reports_taken = 1`;

    const [samplesCollectedResult] = await queryPromise(samplesCollectedQuery, [
      client_id,
      hr_id,
    ]);

    const samplesPendingQuery = `
      SELECT COUNT(*) AS samplesPending
      FROM users u
      WHERE u.client_id = ? AND u.hr_id = ? AND (u.reports_taken = 0 OR u.reports_taken IS NULL)`;

    const [samplesPendingResult] = await queryPromise(samplesPendingQuery, [
      client_id,
      hr_id,
    ]);

    res.status(200).json({
      totalRegistered: totalRegisteredResult.totalRegistered,
      totalUnregistered: unregisteredUsersResult.totalUnregistered,
      samplesCollected: samplesCollectedResult.samplesCollected,
      samplesPending: samplesPendingResult.samplesPending,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEmployeesByHr = async (req, res) => {
  const { client_id, hr_id } = req.query;

  try {
    const query = `
      SELECT 
        u.id, 
        u.phone_number, 
        u.patient_name AS name, 
        u.employee_id, 
        u.email, 
        u.age, 
        u.gender, 
        u.package, 
        u.sub_package, 
        u.booking_id, 
        u.reports_taken, 
        u.additional_info, 
        u.city, 
        u.company_name, 
        u.timeslot
      FROM users u
      WHERE u.client_id = ? AND u.hr_id = ?`;

    const employees = await queryPromise(query, [client_id, hr_id]);
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees by HR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUnregisteredUsers = async (req, res) => {
  const { client_id, hr_id } = req.query;

  if (!client_id || !hr_id) {
    return res.status(400).json({ error: "Missing client_id or hr_id" });
  }

  try {
    const query = `
      SELECT 
        ee.id, 
        ee.employeeId, 
        ee.email, 
        ee.name, 
        ee.phoneNumber, 
        ee.city, 
        ee.companyName
      FROM eligibleusers ee
      LEFT JOIN users u ON ee.employeeId = u.employee_id
      WHERE u.employee_id IS NULL AND ee.client_id = ? AND ee.hr_id = ?
    `;

    const unregisteredUsers = await queryPromise(query, [client_id, hr_id]);
    res.status(200).json(unregisteredUsers);
  } catch (error) {
    console.error("Error fetching unregistered users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function queryPromise(query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function queryPromise(query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function queryPromise(query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  uploadEligibleEmployees,
  getAllEligibleEmployees,
  addEligibleEmployee,
  deleteEligibleEmployee,
  updateEligibleEmployee,
  hrLogin,
  changePassword,
  getDashboardMetrics,
  getEmployeesByHr,
  getUnregisteredUsers,
};
