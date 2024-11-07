const express = require("express");
const router = express.Router();
const onsiteController = require("../controllers/onsite.controller");
const { body, param } = require("express-validator");

const handleValidation = (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/", onsiteController.createOnsiteCollection);

router.get("/", onsiteController.getAllOnsiteCollections);

router.get("/:id", onsiteController.getOnsiteCollectionById);

router.put("/:id", onsiteController.updateOnsiteCollection);

router.delete("/:id", onsiteController.deleteOnsiteCollection);

module.exports = router;
