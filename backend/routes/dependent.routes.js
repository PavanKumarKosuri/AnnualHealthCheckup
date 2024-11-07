const express = require("express");
const router = express.Router();
const dependentController = require("../controllers/dependent.controller");
const { body, param } = require("express-validator");

router.post("/", dependentController.addDependent);

router.get("/:userId", dependentController.getDependentsByUserId);

router.put("/:dependentId", dependentController.updateDependent);

router.delete("/:dependentId", dependentController.deleteDependent);

router.get("/employee/:employeeId", dependentController.getDependentsByEmployeeId);

module.exports = router;
