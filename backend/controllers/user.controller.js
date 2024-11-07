const { db } = require("../config/db.config");
const jwt = require("jsonwebtoken");
const otpService = require("../services/otpService.js");

const getAllUsers = (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving users:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
};

const getUserId = (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const sql = "SELECT id FROM users WHERE phone_number = ?";
  db.query(sql, [phoneNumber], (err, result) => {
    if (err) {
      console.error("Error retrieving userId:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = result[0].id;
    res.status(200).json({ userId });
  });
};

const createUser = (req, res) => {
  const {
    phone_number,
    client_id,
    hr_id,
    patient_name,
    employee_id,
    email,
    age,
    gender,
    package,
    sub_package,
    booking_id,
    reports_taken,
    additional_info,
    city,
    company_name,
    timeslot,
    collection_type,
  } = req.body;

  const newUser = {
    phone_number,
    patient_name: patient_name || "",
    employee_id: employee_id || "",
    email: email || "",
    age: age || null,
    gender: gender || "",
    package: package || "",
    sub_package: sub_package || "",
    booking_id: booking_id || "",
    reports_taken: reports_taken || 0,
    additional_info: additional_info || "",
    city: city || "",
    company_name: company_name || "",
    timeslot: timeslot || "",
    collection_type: collection_type || "offSite",
    client_id: client_id || null,
    hr_id: hr_id || null,
  };

  const insertUserSql = "INSERT INTO users SET ?";
  db.query(insertUserSql, newUser, (err, result) => {
    if (err) {
      console.error("Error creating new user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    userId = result.insertId;
    res.json({
      message: "User create successfully.",
      userId: userId,
    });
  });
};

const updateUser = (req, res) => {
  const {
    patient_name,
    employee_id,
    email,
    age,
    gender,
    package: selectedPackage,
    sub_package: selectedSubPackage,
    booking_id,
    collection_type,
    phone_number,
    timeslot,
    client_id,
    hr_id,
  } = req.body;
  console.log(req.body);
  if (
    !patient_name ||
    !employee_id ||
    !email ||
    !age ||
    !gender ||
    !selectedPackage ||
    !booking_id ||
    !collection_type ||
    !phone_number ||
    !client_id ||
    !hr_id
  ) {
    console.error("Missing required fields.");
    return res.status(400).json({ error: "Missing required fields." });
  }

  const sqlSelect = "SELECT id FROM users WHERE booking_id = ?";

  db.query(sqlSelect, [booking_id], (err, results) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      const userId = results[0].id;

      const updateValues = [
        patient_name,
        employee_id,
        email,
        age,
        gender,
        selectedPackage,
        selectedSubPackage === "" ? null : selectedSubPackage,
        collection_type,
        timeslot,
        client_id,
        hr_id,
        phone_number,
        booking_id,
      ];

      const sqlUpdate = `
        UPDATE users 
        SET 
          patient_name = ?, 
          employee_id = ?, 
          email = ?, 
          age = ?, 
          gender = ?, 
          package = ?, 
          sub_package = ?,
          collection_type = ?,
          timeslot = ?,
          client_id = ?,
          hr_id = ?,
          phone_number = ?
        WHERE booking_id = ?
      `;

      db.query(sqlUpdate, updateValues, (err, result) => {
        if (err) {
          console.error("Error updating user details:", err.message, err.sql);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "No user found with the provided booking ID." });
        }

        res.json({
          message: "User details updated successfully.",
          userId: userId,
        });
      });
    } else {
      return res
        .status(404)
        .json({ error: "No user found with the provided booking ID." });
    }
  });
};

const updateUserById = (req, res) => {
  const { id } = req.params;
  const {
    phone_number,
    patient_name,
    employee_id,
    email,
    age,
    gender,
    package: selectedPackage,
    sub_package: selectedSubPackage,
    booking_id,
    reports_taken,
    additional_info,
    city,
    company_name,
    timeslot,
    collection_type,
    client_id,
    hr_id,
  } = req.body;

  const sql = `
    UPDATE users 
    SET 
      phone_number = ?, 
      patient_name = ?, 
      employee_id = ?, 
      email = ?, 
      age = ?, 
      gender = ?, 
      package = ?, 
      sub_package = ?, 
      booking_id = ?, 
      reports_taken = ?, 
      additional_info = ?, 
      city = ?, 
      company_name = ?, 
      timeslot = ?, 
      collection_type = ?, 
      client_id = ?
      hr_id = ?
    WHERE id = ?
  `;

  const params = [
    phone_number,
    patient_name,
    employee_id,
    email,
    age,
    gender,
    selectedPackage,
    selectedSubPackage || null,
    booking_id,
    reports_taken,
    additional_info,
    city,
    company_name,
    timeslot,
    collection_type,
    client_id,
    id,
    hr_id,
  ];

  db.query(sql, params, (err) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({ message: "User updated successfully" });
  });
};

const updateReportsTakenByBookingId = (req, res) => {
  const bookingId = req.params.bookingId;
  const { reports_taken, additional_info } = req.body;
  const sql =
    "UPDATE users SET reports_taken = ?, additional_info = ? WHERE booking_id = ?";
  db.query(sql, [reports_taken, additional_info, bookingId], (err, result) => {
    if (err) {
      console.error(
        "Error updating reports_taken and additional_info by Booking ID:",
        err
      );
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({
      message:
        "Reports_taken and additional_info updated successfully by Booking ID",
    });
  });
};

const getReportsTaken = (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT reports_taken, additional_info FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error retrieving reports_taken and additional_info:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const { reports_taken, additional_info } = result[0];
    res.status(200).json({ reports_taken, additional_info });
  });
};

const getReportsTakenByBookingId = (req, res) => {
  const bookingId = req.params.bookingId;
  const sql =
    "SELECT patient_name, phone_number, reports_taken, additional_info FROM users WHERE booking_id = ?";
  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error(
        "Error retrieving reports_taken and additional_info by Booking ID:",
        err
      );
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const { patient_name, phone_number, reports_taken, additional_info } =
      result[0];
    res.status(200).json({
      patient_name,
      phone_number,
      reports_taken,
      additional_info,
    });
  });
};

const updateTimeSlot = (req, res) => {
  const { id } = req.params;
  const { client_id } = req.body;
  const timeSlots = [
    "08AM - 09AM",
    "09AM - 10AM",
    "10AM - 11AM",
    "11AM - 12PM",
    "12PM - 01PM",
    "02PM - 03PM",
    "03PM - 04PM",
  ];

  const maxUsersPerSlot = 10;
  const now = new Date();
  const currentHour = now.getHours();
  const todayDate = now.toISOString().split("T")[0];

  const sqlGetUsers = `
    SELECT timeslot 
    FROM users 
    WHERE client_id = ? 
      AND collection_type = 'onSite'
      AND timeslot IS NOT NULL 
      AND DATE(timeslot) = ?
  `;

  const sqlCountSlots = `
    SELECT 
      SUBSTRING_INDEX(timeslot, ' on ', 1) AS slot, 
      COUNT(*) AS count 
    FROM users 
    WHERE client_id = ? 
      AND collection_type = 'onSite'
      AND timeslot IS NOT NULL 
      AND DATE(timeslot) = ?
    GROUP BY slot
  `;

  const assignTimeSlot = (userId, assignedTimeSlot, callback) => {
    const sqlUpdateUser = `
      UPDATE users 
      SET timeslot = ? 
      WHERE id = ?
    `;
    db.query(sqlUpdateUser, [assignedTimeSlot, userId], (err) => {
      if (err) {
        console.error("Error updating user timeslot:", err);
        return callback(err);
      }
      return callback(null, assignedTimeSlot);
    });
  };

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    db.query(sqlCountSlots, [client_id, todayDate], (err, results) => {
      if (err) {
        console.error("Error fetching slot counts:", err);
        return db.rollback(() => {
          res.status(500).json({ error: "Internal Server Error" });
        });
      }

      const slotUserCount = {};
      timeSlots.forEach((slot) => {
        slotUserCount[slot] = 0;
      });

      results.forEach((row) => {
        if (slotUserCount.hasOwnProperty(row.slot)) {
          slotUserCount[row.slot] = row.count;
        }
      });

      let availableSlotToday = null;

      if (currentHour < 15) {
        availableSlotToday = timeSlots.find(
          (slot) => slotUserCount[slot] < maxUsersPerSlot
        );
      }

      if (availableSlotToday) {
        const assignedTimeSlot = `${availableSlotToday} on ${todayDate}`;
        assignTimeSlot(id, assignedTimeSlot, (err, assignedTimeSlot) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: "Internal Server Error" });
            });
          }

          db.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              return db.rollback(() => {
                res.status(500).json({ error: "Internal Server Error" });
              });
            }

            res.status(200).json({ timeslot: assignedTimeSlot });
          });
        });
      } else {
        let nextAvailableDay = 1;
        let assignedTimeSlot = null;

        const findNextAvailableSlot = () => {
          if (nextAvailableDay > 30) {
            return res.status(500).json({ error: "No available slots found." });
          }

          const nextDate = new Date();
          nextDate.setDate(now.getDate() + nextAvailableDay);
          const dateString = nextDate.toISOString().split("T")[0];

          db.query(sqlCountSlots, [client_id, dateString], (err, results) => {
            if (err) {
              console.error("Error fetching slot counts for next date:", err);
              return db.rollback(() => {
                res.status(500).json({ error: "Internal Server Error" });
              });
            }

            const nextSlotUserCount = {};
            timeSlots.forEach((slot) => {
              nextSlotUserCount[slot] = 0;
            });

            results.forEach((row) => {
              if (nextSlotUserCount.hasOwnProperty(row.slot)) {
                nextSlotUserCount[row.slot] = row.count;
              }
            });

            availableSlotToday = timeSlots.find(
              (slot) => nextSlotUserCount[slot] < maxUsersPerSlot
            );

            if (availableSlotToday) {
              assignedTimeSlot = `${availableSlotToday} on ${dateString}`;
              assignTimeSlot(id, assignedTimeSlot, (err, assignedTimeSlot) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({ error: "Internal Server Error" });
                  });
                }

                db.commit((err) => {
                  if (err) {
                    console.error("Error committing transaction:", err);
                    return db.rollback(() => {
                      res.status(500).json({ error: "Internal Server Error" });
                    });
                  }

                  res.status(200).json({ timeslot: assignedTimeSlot });
                });
              });
            } else {
              nextAvailableDay += 1;
              findNextAvailableSlot();
            }
          });
        };

        findNextAvailableSlot();
      }
    });
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};

const updateUserReportsAlternative = (req, res) => {};

const postUsers = (req, res) => {
  const {
    phone_number,
    patient_name,
    employee_id,
    email,
    age,
    gender,
    package: selectedPackage,
    sub_package: selectedSubPackage,
    booking_id,
    reports_taken,
    additional_info,
    city,
    company_name,
    client_id,
  } = req.body;

  const sql =
    "INSERT INTO users (phone_number, patient_name, employee_id, email, age, gender, package, sub_package, booking_id, reports_taken, additional_info, city, company_name, client_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const params = [
    phone_number,
    patient_name,
    employee_id,
    email,
    age,
    gender,
    selectedPackage,
    selectedSubPackage,
    booking_id,
    reports_taken,
    additional_info,
    city,
    company_name,
    client_id,
  ];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error adding user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const userId = results.insertId;

    res.status(201).json({ id: userId });
  });
};

const getUniqueCities = (req, res) => {
  const { client_id } = req.query;
  let sql = "SELECT DISTINCT city FROM users";
  const params = [];

  if (client_id) {
    sql += " WHERE client_id = ?";
    params.push(client_id);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching unique cities:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    const cities = results.map((row) => row.city).filter((city) => city);
    res.json(cities);
  });
};

const getUniqueCompanyNames = (req, res) => {
  const { client_id } = req.query;
  let sql = "SELECT DISTINCT company_name FROM users";
  const params = [];

  if (client_id) {
    sql += " WHERE client_id = ?";
    params.push(client_id);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching unique company names:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    const companyNames = results
      .map((row) => row.company_name)
      .filter((name) => name);
    res.json(companyNames);
  });
};

const filterUsers = (req, res) => {
  const { client_id, searchCriteria, searchText } = req.query;

  let sql = "SELECT * FROM users WHERE 1=1";
  const params = [];

  if (client_id) {
    sql += " AND client_id = ?";
    params.push(client_id);
  }

  if (searchCriteria && searchText) {
    if (searchCriteria === "reports_pending") {
      sql += " AND reports_taken = ?";
      params.push(searchText === "1" ? 1 : 0);
    } else if (searchCriteria === "city" || searchCriteria === "company_name") {
      sql += ` AND ${searchCriteria} = ?`;
      params.push(searchText);
    } else {
      sql += ` AND ${searchCriteria} LIKE ?`;
      params.push(`%${searchText}%`);
    }
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error filtering users:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
};

const getUsersByLocation = (req, res) => {
  const { client_id } = req.query;

  const sql = "SELECT * FROM users WHERE client_id = ?";
  db.query(sql, [client_id], (err, results) => {
    if (err) {
      console.error("Error retrieving users by location:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
};

const getDashboardData = (req, res) => {
  const { client_id } = req.query;

  const sqlTotalUsers =
    "SELECT COUNT(*) as total_users FROM users WHERE client_id = ?";
  const sqlSamplesCollected =
    "SELECT COUNT(*) as samples_collected FROM users WHERE client_id = ? AND reports_taken = 1";
  const sqlSamplesPending =
    "SELECT COUNT(*) as samples_pending FROM users WHERE client_id = ? AND reports_taken = 0";

  db.query(sqlTotalUsers, [client_id], (err, totalUsersResult) => {
    if (err) {
      console.error("Error retrieving total users:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    db.query(
      sqlSamplesCollected,
      [client_id],
      (err, samplesCollectedResult) => {
        if (err) {
          console.error("Error retrieving samples collected:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        db.query(
          sqlSamplesPending,
          [client_id],
          (err, samplesPendingResult) => {
            if (err) {
              console.error("Error retrieving samples pending:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            res.status(200).json({
              total_users: totalUsersResult[0].total_users,
              samples_collected: samplesCollectedResult[0].samples_collected,
              samples_pending: samplesPendingResult[0].samples_pending,
            });
          }
        );
      }
    );
  });
};

const validateClient = (req, res) => {
  const { client_id } = req.params;

  const query = "SELECT * FROM clients WHERE client_id = ?";
  db.query(query, [client_id], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      const token = jwt.sign(
        { client_id: results[0].client_id, name: results[0].name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ valid: true, token });
    } else {
      return res
        .status(404)
        .json({ valid: false, message: "Client not found" });
    }
  });
};

const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    await otpService.sendOTP(phoneNumber);
    res.status(200).json({ status: "Success" });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    await otpService.verifyOTP(phoneNumber, otp);
    res.status(200).json({ verified: true });
  } catch (error) {
    res.status(400).json({ verified: false, error: error.message });
  }
};

const verifyEmployee = (req, res) => {
  const { employeeId, phoneNumber } = req.query;
  const query =
    "SELECT name, email, age, gender FROM eligibleusers WHERE employeeId = ? AND phoneNumber = ?";
  db.query(query, [employeeId, phoneNumber], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(200).json({ isValid: false });
    }
    return res.status(200).json({
      isValid: true,
      name: results[0].name,
      email: results[0].email,
      gender: results[0].gender,
      age: results[0].age,
    });
  });
};

const getUserByEmployeeId = (req, res) => {
  const { employeeId } = req.query;
  const sql = "SELECT * FROM users WHERE employee_id = ?";

  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID is required" });
  }

  db.query(sql, [employeeId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(results[0]);
  });
};

const getUserBookings = (req, res) => {
  const { employeeId } = req.params;
  const sql = `
    SELECT *,
    STR_TO_DATE(SUBSTRING_INDEX(timeslot, ' on ', -1), '%Y-%m-%d') AS booking_date
    FROM users
    WHERE employee_id = ?
    ORDER BY booking_date DESC, timeslot DESC
  `;

  db.query(sql, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(results);
  });
};

const deleteBooking = (req, res) => {
  const { bookingId } = req.params;

  const sql = "DELETE FROM users WHERE booking_id = ?";

  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error("Error deleting booking:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.status(200).json({ message: "Booking deleted successfully." });
  });
};

const getBookingDetailsw = (req, res) => {
  const { bookingId } = req.params;

  const userSql = `
    SELECT *
    FROM users
    WHERE booking_id = ?
  `;

  db.query(userSql, [bookingId], (err, userResults) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const user = userResults[0];
    const collectionType = user.collection_type;
    const booking = { user };

    const fetchDependents = () => {
      const dependentsSql = `
        SELECT *
        FROM dependents
        WHERE bookingId LIKE ?
      `;
      const bookingIdPattern = `${bookingId}%`;

      db.query(dependentsSql, [bookingIdPattern], (err, dependentsResults) => {
        if (err) {
          console.error("Error fetching dependents:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        booking.dependents = dependentsResults;
        res.status(200).json(booking);
      });
    };

    const fetchOffsiteData = () => {
      const offsiteSql = `
        SELECT *
        FROM offsite_collections
        WHERE user_id = ?
      `;

      db.query(offsiteSql, [user.id], (err, offsiteResults) => {
        if (err) {
          console.error("Error fetching offsite collections:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (offsiteResults.length === 0) {
          return res
            .status(404)
            .json({ error: "Offsite collection not found" });
        }

        const offsite = offsiteResults[0];
        booking.offsite = offsite;

        const locationSql = `
          SELECT *
          FROM offsite_locations
          WHERE id = ?
        `;

        db.query(
          locationSql,
          [offsite.offsite_location_id],
          (err, locationResults) => {
            if (err) {
              console.error("Error fetching offsite location:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (locationResults.length === 0) {
              return res
                .status(404)
                .json({ error: "Offsite location not found" });
            }

            booking.offsiteLocation = locationResults[0];

            const centerSql = `
            SELECT *
            FROM diagnostic_centers
            WHERE id = ?
          `;

            db.query(
              centerSql,
              [offsite.diagnostic_center_id],
              (err, centerResults) => {
                if (err) {
                  console.error("Error fetching diagnostic center:", err);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                if (centerResults.length === 0) {
                  return res
                    .status(404)
                    .json({ error: "Diagnostic center not found" });
                }

                booking.diagnosticCenter = centerResults[0];
                fetchDependents();
              }
            );
          }
        );
      });
    };

    const fetchHomeCollectionData = () => {
      const homeSql = `
        SELECT *
        FROM home_collections
        WHERE user_id = ?
      `;

      db.query(homeSql, [user.id], (err, homeResults) => {
        if (err) {
          console.error("Error fetching home collections:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (homeResults.length === 0) {
          return res.status(404).json({ error: "Home collection not found" });
        }

        const home = homeResults[0];
        booking.homeCollection = home;

        fetchDependents();
      });
    };

    if (collectionType.toLowerCase() === "offsite") {
      fetchOffsiteData();
    } else if (collectionType.toLowerCase() === "home") {
      fetchHomeCollectionData();
    } else {
      res.status(400).json({ error: "Unsupported collection type" });
    }
  });
};

// src/controllers/userController.js

const getBookingDetails = (req, res) => {
  const { bookingId } = req.params;

  const userSql = `
    SELECT *
    FROM users
    WHERE booking_id = ?
  `;

  db.query(userSql, [bookingId], (err, userResults) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const user = userResults[0];
    const collectionType = user.collection_type.toLowerCase(); // Ensure lowercase
    const booking = { user };

    const fetchDependents = () => {
      // Since "onsite" does not have dependents, we skip this for "onsite"
      if (collectionType === "onsite") {
        return res.status(200).json(booking);
      }

      const dependentsSql = `
        SELECT *
        FROM dependents
        WHERE bookingId LIKE ?
      `;
      const bookingIdPattern = `${bookingId}%`;

      db.query(dependentsSql, [bookingIdPattern], (err, dependentsResults) => {
        if (err) {
          console.error("Error fetching dependents:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        booking.dependents = dependentsResults;
        res.status(200).json(booking);
      });
    };

    const fetchOffsiteData = () => {
      const offsiteSql = `
        SELECT *
        FROM offsite_collections
        WHERE user_id = ?
      `;

      db.query(offsiteSql, [user.id], (err, offsiteResults) => {
        if (err) {
          console.error("Error fetching offsite collections:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (offsiteResults.length === 0) {
          return res
            .status(404)
            .json({ error: "Offsite collection not found" });
        }

        const offsite = offsiteResults[0];
        booking.offsite = offsite;

        const locationSql = `
          SELECT *
          FROM offsite_locations
          WHERE id = ?
        `;

        db.query(
          locationSql,
          [offsite.offsite_location_id],
          (err, locationResults) => {
            if (err) {
              console.error("Error fetching offsite location:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (locationResults.length === 0) {
              return res
                .status(404)
                .json({ error: "Offsite location not found" });
            }

            booking.offsiteLocation = locationResults[0];

            const centerSql = `
              SELECT *
              FROM diagnostic_centers
              WHERE id = ?
            `;

            db.query(
              centerSql,
              [offsite.diagnostic_center_id],
              (err, centerResults) => {
                if (err) {
                  console.error("Error fetching diagnostic center:", err);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                if (centerResults.length === 0) {
                  return res
                    .status(404)
                    .json({ error: "Diagnostic center not found" });
                }

                booking.diagnosticCenter = centerResults[0];
                fetchDependents();
              }
            );
          }
        );
      });
    };

    const fetchHomeCollectionData = () => {
      const homeSql = `
        SELECT *
        FROM home_collections
        WHERE user_id = ?
      `;

      db.query(homeSql, [user.id], (err, homeResults) => {
        if (err) {
          console.error("Error fetching home collections:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (homeResults.length === 0) {
          return res.status(404).json({ error: "Home collection not found" });
        }

        const home = homeResults[0];
        booking.homeCollection = home;

        fetchDependents();
      });
    };

    const fetchOnsiteCollectionData = () => {
      const onsiteSql = `
        SELECT *
        FROM onsite_collections
        WHERE user_id = ?
      `;

      db.query(onsiteSql, [user.id], (err, onsiteResults) => {
        if (err) {
          console.error("Error fetching onsite collections:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (onsiteResults.length === 0) {
          return res.status(404).json({ error: "Onsite collection not found" });
        }

        const onsite = onsiteResults[0];
        booking.onsiteCollection = onsite;

        // Since "onsite" doesn't have locations or offices, we skip fetching them

        fetchDependents();
      });
    };

    if (collectionType === "offsite") {
      fetchOffsiteData();
    } else if (collectionType === "home") {
      fetchHomeCollectionData();
    } else if (collectionType === "onsite") {
      fetchOnsiteCollectionData();
    } else {
      res.status(400).json({ error: "Unsupported collection type" });
    }
  });
};

module.exports = {
  validateClient,
  sendOTP,
  verifyOTP,
  verifyEmployee,
  getUserByEmployeeId,
};

module.exports = {
  getAllUsers,
  getUserId,
  createUser,
  updateUser,
  updateUserById,
  updateReportsTakenByBookingId,
  getReportsTaken,
  getReportsTakenByBookingId,
  updateTimeSlot,
  deleteUser,
  postUsers,
  getUsersByLocation,
  getDashboardData,
  getUniqueCities,
  getUniqueCompanyNames,
  filterUsers,
  validateClient,
  sendOTP,
  verifyOTP,
  verifyEmployee,
  getUserByEmployeeId,
  getUserBookings,
  getBookingDetails,
  deleteBooking,
};
