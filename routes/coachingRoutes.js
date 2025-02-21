const express = require("express");
const router = express.Router();
const coachingController = require("../controller/coachingController");
const authController = require("../controller/authController");
// const {getUploader}  = require("../utils/cloudnary");
// const uploadGround = getUploader('coaching', 800, 800);

router
  .route("/")
  .get(authController.protect, coachingController.getAllCoaching)
  // .post(authController.protect,coachingController.addCoaching);
  .post(
    authController.protect,
    coachingController.uploadUserPhoto,
    coachingController.resizeCoachingImages,
    coachingController.addCoaching
  );


router.get("/adminCoaching",authController.protect,coachingController.getAdminCoaching);

router
  .route("/:id")
  .get(authController.protect, coachingController.getCoaching)
  .patch(authController.protect, coachingController.uploadUserPhoto, coachingController.updateCoaching)
  .delete(authController.protect, coachingController.deleteCoaching);

module.exports = router;
