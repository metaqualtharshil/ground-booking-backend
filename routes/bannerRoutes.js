const express = require("express");
const authController = require("../controller/authController");
const bannerController = require("../controller/bannerController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, bannerController.getBanner)
  .post(
    authController.protect,
    bannerController.uploadBannerPhoto,
    bannerController.resizeBannerPhoto,
    bannerController.addBanner
  );

router
  .route("/:id")
  .get(authController.protect, bannerController.getOneBanner)
  .patch(
    authController.protect,
    bannerController.uploadBannerPhoto,
    bannerController.resizeBannerPhoto,
    bannerController.updateBanner
  )
  .delete(authController.protect, bannerController.deleteBanner);

module.exports = router;
