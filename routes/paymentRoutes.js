const express = require("express");
const authController = require("../controller/authController");
const paymentController = require("../controller/paymentController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, paymentController.getPayment)
  .post(authController.protect, paymentController.addPayment);

router
  .route("/:id")
  .patch(authController.protect, paymentController.updatePayment)
  .delete(authController.protect, paymentController.deletePayment);

router.get("/getTotalRevenue",authController.protect,paymentController.getTotalRevenue);
module.exports = router;
