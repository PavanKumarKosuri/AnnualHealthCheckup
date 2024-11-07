const express = require("express");
const router = express.Router();
const phlebotomistController = require("../controllers/phlebotomist.controller");

router.post("/register", phlebotomistController.registerPhlebotomist);

router.get("/", phlebotomistController.getAllPhlebotomists);

router.get("/:id", phlebotomistController.getPhlebotomistDetails);

router.post("/:id/assign", phlebotomistController.assignPhlebotomist);

router.post("/:id/unassign", phlebotomistController.unassignPhlebotomist);

router.get(
  "/:id/assignments",
  phlebotomistController.getPhlebotomistAssignments
);

router.get(
  "/:id/performance",
  phlebotomistController.getPhlebotomistPerformance
);

router.get("/:id/download", phlebotomistController.downloadPhlebotomistDetails);

module.exports = router;
