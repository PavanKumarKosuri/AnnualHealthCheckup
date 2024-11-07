const express = require("express");
const router = express.Router();
const packageController = require("../controllers/package.controller");
const authenticateJWT = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

router.use(authenticateJWT);

router.get(
  "/clients/:clientId/packages",
  packageController.getPackagesByClient
);
router.get("/:id", packageController.getPackageById);
router.post("/", packageController.createPackage);
router.put("/:id", packageController.updatePackage);
router.delete("/:id", packageController.deletePackage);

module.exports = router;
