const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.post("/login", adminController.login);
router.post("/change-password", adminController.changePassword);

module.exports = router;
