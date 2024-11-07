const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller.js");
const authenticateJWT = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

router.use(authenticateJWT);

router.get("/", clientController.getClients);
router.get("/:id", clientController.getClientById);
router.get("/client/:client_id", clientController.getClientByClientId);
router.post("/", clientController.createClient);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

module.exports = router;
