const express = require("express");
const router = express.Router();
const diagnosticController = require("../controllers/diagnostic.controller");
const { body, param } = require("express-validator");

const handleValidation = (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/", diagnosticController.createDiagnosticCenter);

router.get("/", diagnosticController.getAllDiagnosticCenters);

router.get("/:id", diagnosticController.getDiagnosticCenterById);

router.put("/:id", diagnosticController.updateDiagnosticCenter);

router.delete("/:id", diagnosticController.deleteDiagnosticCenter);

router.get(
  "/location/:locationId",
  diagnosticController.getDiagnosticCentersByLocationId
);

module.exports = router;
