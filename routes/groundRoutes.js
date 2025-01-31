const express = require("express");
const groundController = require("../controller/groundController");
const authController = require("../controller/authController");
const upload = require("../utils/cloudnary");
const router = express.Router();

router
  .route("/sport")
  .get(authController.protect, groundController.getAllSportsName);

router.get("/getAllGroundForAdmin",authController.protect,groundController.getAdminGrounds);

router
  .route("/")
  .get(authController.protect, groundController.getGrounds)
  .post(
    authController.protect,
    groundController.uploadUserPhoto,
    groundController.resizeGroundImages,
    groundController.addGround
  );

router
  .route("/:id")
  .get(authController.protect, groundController.getGround)
  .patch(authController.protect, groundController.uploadUserPhoto,groundController.updateGround)
  .delete(authController.protect, groundController.deleteGround);

module.exports = router;
