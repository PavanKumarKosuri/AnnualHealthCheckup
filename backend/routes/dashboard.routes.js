// backend/routes/dashboard.routes.js

const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authenticateJWT = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

// Apply authentication and authorization middleware
router.use(authenticateJWT, authorizeRoles("superadmin"));

// Dashboard endpoint
router.get("/", dashboardController.fetchDashboardData);

module.exports = router;
