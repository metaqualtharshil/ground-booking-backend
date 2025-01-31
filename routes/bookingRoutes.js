const express = require("express");
const authController = require("../controller/authController");
const bookingController = require("../controller/bookingController");
const booking = express.Router();
const bookingAdmin = express.Router();

booking.route("/")
            .get(authController.protect,bookingController.getBooking)
            .post(authController.protect,bookingController.addBooking);

booking.route("/:id")
            .get(authController.protect,bookingController.getOneBooking)
            .patch(authController.protect,bookingController.updateBooking)
            .delete(authController.protect,bookingController.deleteBooking);

booking.get("/userBooking/:userId",authController.protect,bookingController.getUserBooking);

booking.route("/user-booking/upcoming").get(authController.protect,bookingController.upcomingBooking);

booking.route("/user-booking/history").get(authController.protect,bookingController.historyBookingList);

bookingAdmin.route("/admin-all-booking").get(authController.protect,bookingController.getAllGroundBookingForAdmin);

module.exports = {booking,bookingAdmin};