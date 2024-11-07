const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/auth");
const paymentController = require("../controllers/payment.controller");

router.post("/create", authenticateJWT, paymentController.createPayment);

router.post("/update", authenticateJWT, paymentController.updatePayment);

router.get(
  "/booking/:bookingId",
  authenticateJWT,
  paymentController.getPaymentByBookingId
);

router.post("/refund", authenticateJWT, paymentController.handleRefund);

module.exports = router;
