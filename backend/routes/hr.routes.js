const express = require("express");
const router = express.Router();
const hrController = require("../controllers/hr.controller");
const multer = require("multer");
const authenticateJWT = require("../middleware/auth");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/login", hrController.hrLogin);
router.post("/change-password", hrController.changePassword);

router.post(
  "/eligibleEmployees/upload/:client_id/:hr_id",
  authenticateJWT,
  upload.single("file"),
  hrController.uploadEligibleEmployees
);

router.get(
  "/eligibleEmployees/get/:client_id/:hr_id",
  authenticateJWT,
  hrController.getAllEligibleEmployees
);
router.post(
  "/eligibleEmployees/add",
  authenticateJWT,
  hrController.addEligibleEmployee
);
router.put(
  "/eligibleEmployees/:id/update",
  authenticateJWT,
  hrController.updateEligibleEmployee
);
router.delete(
  "/eligibleEmployees/:id/delete",
  authenticateJWT,
  hrController.deleteEligibleEmployee
);

router.get(
  "/users/dashboard-metrics",
  authenticateJWT,
  hrController.getDashboardMetrics
);
router.get("/users/by-hr", authenticateJWT, hrController.getEmployeesByHr);
router.get(
  "/users/unregistered",
  authenticateJWT,
  hrController.getUnregisteredUsers
);

module.exports = router;
