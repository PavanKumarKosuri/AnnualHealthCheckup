process.env.TZ = "Asia/Kolkata";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const dotenv = require("dotenv");
const path = require("path");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
dotenv.config();

const app = express();
const port = 8080;

const corsOptions = {
  origin: "*",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use(compression());
app.use(fileUpload());

app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next(err);
});

app.use("/reports", express.static(path.join(__dirname, "reports")));

const { db } = require("./config/db.config");

function createDatabaseAndTables(callback) {
  db.query(`CREATE DATABASE IF NOT EXISTS sql12743206;`, (err) => {
    if (err) {
      console.error("Error creating database:", err);
      return;
    }
    useDatabaseAndCreateTables(callback);
  });
}

function useDatabaseAndCreateTables(callback) {
  db.query(`USE sql12743206;`, (err) => {
    if (err) {
      console.error("Error selecting database:", err);
      return;
    }
    createTablesSequentially(0, callback);
  });
}

const createTables = [
  `CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    client_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    industry_type VARCHAR(100),
    number_of_employees INT,
    annual_revenue DECIMAL(15,2),
    services_requested_onsite BOOLEAN DEFAULT FALSE,
    services_requested_offsite BOOLEAN DEFAULT FALSE,
    services_requested_homecollection BOOLEAN DEFAULT FALSE,
    preferred_service_times VARCHAR(255),
    special_requirements TEXT,
    contact_person_name VARCHAR(255),
    contact_person_designation VARCHAR(100),
    contact_person_phone_number VARCHAR(50),
    contact_person_email VARCHAR(255),
    certifications VARCHAR(255),
    billing_address VARCHAR(255),
    preferred_payment_methods VARCHAR(255),
    credit_terms VARCHAR(100),
    communication_channels VARCHAR(255),
    integration_requirements TEXT,
    notes TEXT,
    compliance_certifications TEXT,
    data_integration_details TEXT,
    sla_details TEXT,
    insurance_details TEXT,
    consent_agreements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS eligibleusers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeId VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    companyName VARCHAR(255),
    client_id VARCHAR(36) NOT NULL,
    hr_id INT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (hr_id) REFERENCES hrdata(id) ON DELETE CASCADE
);`,

  `CREATE TABLE IF NOT EXISTS phlebotomists (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    uniqueId VARCHAR(50) UNIQUE NOT NULL, 
    phoneNumber VARCHAR(20), 
    email VARCHAR(255) UNIQUE NOT NULL, 
    age INT CHECK (age > 0), 
    gender VARCHAR(20), 
    city VARCHAR(100), 
    company VARCHAR(100), 
    status VARCHAR(20) CHECK (status IN ('free', 'assigned')), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS medical_camps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    camp_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    organizer VARCHAR(255),
    contact_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS generateqr (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    companyName VARCHAR(255) NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS hrdata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empid VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phonenumber VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    companyname VARCHAR(255) NOT NULL,
    uniquekey VARCHAR(255) NOT NULL,
    password VARCHAR(255) DEFAULT 'change_me',
    client_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS ltadmin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    serviceType ENUM('testing', 'phlebotomy', 'both') NOT NULL,
    testingCapacity INT,
    turnaroundTime VARCHAR(50),
    accreditations TEXT,
    phlebotomistCount INT
  );`,

  `CREATE TABLE IF NOT EXISTS offsite_locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zipCode VARCHAR(10) NOT NULL,
  landmark VARCHAR(255),
  contactNumber VARCHAR(20) NOT NULL,
  longitude DECIMAL(10, 8) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL
);`,

  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    hr_id INT NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    patient_name VARCHAR(255),
    employee_id VARCHAR(255),
    email VARCHAR(255),
    age INT,
    gender VARCHAR(10),
    package VARCHAR(255),
    sub_package VARCHAR(255),
    booking_id VARCHAR(255),
    reports_taken TINYINT(1),
    additional_info TEXT,
    city VARCHAR(255),
    company_name VARCHAR(255),
    timeslot VARCHAR(255),
    collection_type ENUM('onSite', 'home', 'offSite') NOT NULL DEFAULT 'onSite',
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (hr_id) REFERENCES hrdata(id) ON DELETE CASCADE
);`,

  `CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(255) NOT NULL,
    entity_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phlebotomist_id INT NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (phlebotomist_id) REFERENCES phlebotomists(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    CONSTRAINT chk_dates CHECK (end_date >= start_date)
  );`,

  `CREATE TABLE IF NOT EXISTS blood_collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phlebotomist_id INT NOT NULL,
    user_id INT NOT NULL,
    collection_date DATE NOT NULL,
    collection_time TIME NOT NULL,
    test_type VARCHAR(100),
    results TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (phlebotomist_id) REFERENCES phlebotomists(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS subpackages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS diagnostic_centers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zipCode VARCHAR(10) NOT NULL,
  landmark VARCHAR(255),
  contactNumber VARCHAR(20) NOT NULL,
  location_id INT,
  longitude DECIMAL(10, 8) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  FOREIGN KEY (location_id) REFERENCES offsite_locations(id) ON DELETE CASCADE
);`,

  `CREATE TABLE IF NOT EXISTS onsite_collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scheduledDate DATE NOT NULL,
    scheduledTime TIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS home_collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dependents_count INT DEFAULT 0,
    streetAddress VARCHAR(255) NOT NULL,
    cityAddress VARCHAR(255) NOT NULL,
    stateAddress VARCHAR(255) NOT NULL,
    zipCode VARCHAR(10) NOT NULL,
    landmark VARCHAR(255),
    scheduledDate DATE NOT NULL,
    scheduledTime TIME NOT NULL,
    preferredVendor VARCHAR(100) NOT NULL,
    preferredLanguage VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS offsite_collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    offsite_location_id INT NOT NULL,
    diagnostic_center_id INT NOT NULL,
    dependents_count INT DEFAULT 0,
    scheduledDate DATE NOT NULL,
    scheduledTime TIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (offsite_location_id) REFERENCES offsite_locations(id) ON DELETE RESTRICT,
    FOREIGN KEY (diagnostic_center_id) REFERENCES diagnostic_centers(id) ON DELETE RESTRICT
  );`,

  `CREATE TABLE IF NOT EXISTS dependents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, 
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    relationship VARCHAR(255) NOT NULL,
    gender VARCHAR(10),
    package VARCHAR(255),
    subPackage VARCHAR(255),
    bookingId VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  booking_id VARCHAR(255) NOT NULL,
  dependents TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('pending', 'completed', 'refunded', 'failed') DEFAULT 'pending',
  razorpay_payment_id VARCHAR(255),
  signature_id VARCHAR(255),
  transaction_id VARCHAR(255),
  order_id VARCHAR(255),
  settlement_id VARCHAR(255),
  time_of_payment TIME,
  date_of_payment DATE,
  refund_amount DECIMAL(10, 2),
  refund_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`,
];

function createTablesSequentially(index, callback) {
  if (index >= createTables.length) {
    callback();
    return;
  }

  db.query(createTables[index], (err) => {
    if (err) {
      console.error(`Error creating table ${index + 1}:`, err);
    }
    createTablesSequentially(index + 1, callback);
  });
}

function checkDatabaseExistsAndProceed(callback) {
  const checkDatabaseQuery = `SHOW DATABASES LIKE 'sql12743206';`;

  db.query(checkDatabaseQuery, (err, results) => {
    if (err) {
      console.error("Error checking for database existence:", err);
      return;
    }

    if (results.length === 0) {
      createDatabaseAndTables(callback);
    } else {
      useDatabaseAndCreateTables(callback);
    }
  });
}

const clientRoutes = require("./routes/client.routes");
const adminRoutes = require("./routes/admin.routes");
const ltRoutes = require("./routes/lt.routes");
const userRoutes = require("./routes/user.routes");
const phlebotomistRoutes = require("./routes/phlebotomist.routes");
const vendorRoutes = require("./routes/vendor.routes");
const hrRoutes = require("./routes/hr.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const reportRoutes = require("./routes/report.routes");
const packageRoutes = require("./routes/package.routes");
const subpackageRoutes = require("./routes/subpackage.routes");
const sampleRoutes = require("./routes/sample.routes");
const paymentRoutes = require("./routes/payment.routes");

const onsiteRoutes = require("./routes/onsite.routes");
const homeRoutes = require("./routes/home.routes");
const offsiteRoutes = require("./routes/offsite.routes");
const diagnosticRoutes = require("./routes/diagnostic.routes");
const offsiteLocationRoutes = require("./routes/offsiteLocation.routes");
const dependentRoutes = require("./routes/dependent.routes");

const adminController = require("./controllers/admin.controller");
const ltController = require("./controllers/lt.controller");

app.use("/api/admin", adminRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subpackages", subpackageRoutes);
app.use("/api/lt", ltRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/phlebotomists", phlebotomistRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/onsite-collections", onsiteRoutes);
app.use("/api/home-collections", homeRoutes);
app.use("/api/offsite-collections", offsiteRoutes);
app.use("/api/diagnostic-centers", diagnosticRoutes);
app.use("/api/offsite-locations", offsiteLocationRoutes);
app.use("/api/dependents", dependentRoutes);
app.use("/api/samples", sampleRoutes);

function initializeControllers() {
  adminController.createAdminUser();
  ltController.createLtUser();
}

checkDatabaseExistsAndProceed(() => {
  initializeControllers();
  app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
});
