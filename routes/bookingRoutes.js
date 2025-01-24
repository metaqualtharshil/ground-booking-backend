const express = require("express");
const authController = require("../controller/authController");
const bookingController = require("../controller/bookingController");
const router = express.Router();

router.route("/")
            .get(authController.protect,bookingController.getBooking)
            .post(authController.protect,bookingController.addBooking);

router.route("/:id")
            .get(authController.protect,bookingController.getOneBooking)
            .patch(authController.protect,bookingController.updateBooking)
            .delete(authController.protect,bookingController.deleteBooking);

router.get("/userBooking/:userId",authController.protect,bookingController.getUserBooking);

router.route("/user-booking/upcoming").get(authController.protect,bookingController.upcomingBooking);

router.route("/user-booking/history").get(authController.protect,bookingController.historyBookingList);

module.exports = router;