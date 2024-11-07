// backend\routes\report.routes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");

router.get("/", reportController.getReports);
router.get("/download/:filename", reportController.downloadReport);

module.exports = router;
