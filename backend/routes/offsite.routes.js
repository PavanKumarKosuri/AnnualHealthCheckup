const express = require("express");
const router = express.Router();
const offsiteController = require("../controllers/offsite.controller");
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

router.post("/", offsiteController.createOffsiteCollection);

router.get("/", offsiteController.getAllOffsiteCollections);

router.get("/:id", offsiteController.getOffsiteCollectionById);

router.put("/:id", offsiteController.updateOffsiteCollection);

router.delete("/:id", offsiteController.deleteOffsiteCollection);

router.get(
  "/diagnostic-centers/by-location/:locationId",
  diagnosticController.getDiagnosticCentersByLocationId
);

module.exports = router;
