const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const upload  = require("../utils/cloudnary");
// const uploadGround = getUploader('user', 800, 800);
const router = express.Router();

router.patch("/updateMe",authController.protect,userController.uploadUserPhoto,
    userController.resizeUserPhoto,userController.updateMe);

router.get("/me",authController.protect,userController.getMe);

router.post('/signup',authController.signUp);
router.post('/login',authController.login);
router.post('/updatePassword',authController.protect,authController.updatePassword);

// router.post('/forgetPassword',authController.forgetPassword);
router.post('/forgetPassword',authController.generateOtp);
router.post('/resetPassword/:token',authController.resetPassowrd);

router.post('/generate-otp',authController.generateOtp);
router.post('/verify-otp',authController.verifyOtp);

module.exports = router;