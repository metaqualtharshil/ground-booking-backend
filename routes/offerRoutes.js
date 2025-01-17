const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");
const offerController = require("../controller/offerController");


router.route("/")
            .get(authController.protect,offerController.getOffer)
            .post(authController.protect,offerController.addOffer);

router.route("/:id")
            .patch(authController.protect,offerController.updateOffer)
            .delete(authController.protect,offerController.deleteOffer);


module.exports = router;
