const express = require("express");
const router = express.Router();
const ltController = require("../controllers/lt.controller");

router.post("/login", ltController.login);
router.post("/change-password", ltController.changePassword);

module.exports = router;
