const express = require('express');
const groundController = require('../controller/groundController');
const authController = require('../controller/authController');

const router = express.Router();


router.route('/').get(authController.protect,groundController.getGrounds).post(authController.protect,groundController.addGround);

router.route("/:id")
        .get(authController.protect,groundController.getGround) 
        .patch(authController.protect,groundController.updateGround) 
        .delete(authController.protect,groundController.deleteGround);

module.exports = router;