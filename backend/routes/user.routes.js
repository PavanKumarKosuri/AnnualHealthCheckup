const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body, param, query } = require("express-validator");
const authenticateJWT = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

router.get("/", authorizeRoles("superadmin"), userController.getAllUsers);

router.get("/user/:phoneNumber", authenticateJWT, userController.getUserId);

router.post("/user", authenticateJWT, userController.createUser);

router.put("/user/update", authenticateJWT, userController.updateUser);

router.put("/:id", authenticateJWT, userController.updateUserById);

router.put(
  "/reports-taken/:bookingId",
  authenticateJWT,
  userController.updateReportsTakenByBookingId
);

router.get(
  "/:id/reports-taken",
  authenticateJWT,
  userController.getReportsTaken
);

router.get(
  "/reports-taken/:bookingId",
  authenticateJWT,
  userController.getReportsTakenByBookingId
);

router.put("/timeslot/:id", authenticateJWT, userController.updateTimeSlot);

router.delete("/:id", authenticateJWT, userController.deleteUser);

router.post("/", authenticateJWT, userController.postUsers);

router.get("/by-location", authenticateJWT, userController.getUsersByLocation);

router.get(
  "/get-dashboardData",
  authenticateJWT,
  userController.getDashboardData
);

router.get("/cities", authenticateJWT, userController.getUniqueCities);

router.get("/company_names", userController.getUniqueCompanyNames);

router.get("/filter", authenticateJWT, userController.filterUsers);

router.get("/validate-client/:client_id", userController.validateClient);

router.get("/verify-employee", authenticateJWT, userController.verifyEmployee);
router.get(
  "/get-user-by-employee-id",
  authenticateJWT,
  userController.getUserByEmployeeId
);
router.get("/", authenticateJWT, userController.getAllUsers);
router.put("/:id", authenticateJWT, userController.updateUserById);
router.post("/send-otp", authenticateJWT, userController.sendOTP);
router.post("/verify-otp", authenticateJWT, userController.verifyOTP);
// Add this route to fetch bookings for a user
router.get(
  "/:employeeId/bookings",
  authenticateJWT,
  userController.getUserBookings
);
router.get(
  "/:bookingId/bookings",
  authenticateJWT,
  userController.getUserBookings
);
router.delete(
  "/bookings/:bookingId",
  authenticateJWT,
  userController.deleteBooking
);
router.get(
  "/bookings/:bookingId/details",
  authenticateJWT,
  userController.getBookingDetails
);

module.exports = router;
