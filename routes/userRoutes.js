const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const upload = require('../utils/cloudnary');
const router = express.Router();

router.post('/signup',authController.signUp);
router.post('/login',authController.login);
router.post('/updatePassword',authController.protect,authController.updatePassword);

router.post('/forgetPassword',authController.forgetPassword);
router.post('/resetPassword/:token',authController.resetPassowrd);

router.patch("/updateMe",authController.protect,userController.updateMe);

module.exports = router;