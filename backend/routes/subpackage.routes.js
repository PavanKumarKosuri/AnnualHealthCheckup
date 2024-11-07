const express = require("express");
const router = express.Router();
const subpackageController = require("../controllers/subpackage.controller");
const authenticateJWT = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

router.use(authenticateJWT);

router.get(
  "/packages/:packageId",
  subpackageController.getSubpackagesByPackage
);

router.get("/:id", subpackageController.getSubpackageById);

router.post("/", subpackageController.createSubpackage);

router.put("/:id", subpackageController.updateSubpackage);

router.delete("/:id", subpackageController.deleteSubpackage);

module.exports = router;
