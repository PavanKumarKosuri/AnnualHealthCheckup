const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");

router.post("/", homeController.createHomeCollection);

router.get("/", homeController.getAllHomeCollections);

router.get("/:id", homeController.getHomeCollectionById);

router.put("/:user_id", homeController.updateHomeCollection);

router.delete("/:id", homeController.deleteHomeCollection);

module.exports = router;
