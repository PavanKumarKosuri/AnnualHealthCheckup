const express = require("express");
const router = express.Router();
const managerController = require("../controllers/manager.controller");
const multer = require("multer");
const authenticateJWT = require("../middleware/auth");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/upload-excel",
  authenticateJWT,
  upload.single("file"),
  hrController.uploadExcel
);

router.get("/get-all-hrdata", authenticateJWT, managerController.getAllHrData);
router.put("/update-hr/:id", authenticateJWT, managerController.updateHrData);
router.delete(
  "/delete-hr/:id",
  authenticateJWT,
  managerController.deleteHrData
);
router.post("/add-hr", authenticateJWT, managerController.addHrData);
router.get("/get-unique-key", authenticateJWT, managerController.getUniqueKey);
router.get(
  "/get-last-entries",
  authenticateJWT,
  managerController.getLastEntries
);
