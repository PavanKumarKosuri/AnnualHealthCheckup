const express = require("express");
const router = express.Router();
const {
  uploadZipFile,
  processReports,
} = require("../controllers/sample.controller");
const auth = require("../middleware/auth");

router.post("/upload-zip", auth, uploadZipFile);
router.post("/process-reports", auth, processReports);

module.exports = router;
