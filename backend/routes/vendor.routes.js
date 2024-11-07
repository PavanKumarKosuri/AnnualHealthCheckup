const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");

router.get("/", vendorController.getVendors);
router.post("/", vendorController.addVendor);
router.put("/:id", vendorController.updateVendor);
router.delete("/:id", vendorController.deleteVendor);
router.get("/city/:city", vendorController.getVendorsByCity);

module.exports = router;
