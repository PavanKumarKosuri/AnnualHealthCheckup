const express = require("express");
const router = express.Router();
const offsiteLocationController = require("../controllers/offsiteLocation.controller");
const { body, param } = require("express-validator");

const handleValidation = (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/", offsiteLocationController.createOffsiteLocation);

router.get("/", offsiteLocationController.getAllOffsiteLocations);

router.get("/:id", offsiteLocationController.getOffsiteLocationById);

router.put("/:id", offsiteLocationController.updateOffsiteLocation);

router.delete("/:id", offsiteLocationController.deleteOffsiteLocation);

module.exports = router;
