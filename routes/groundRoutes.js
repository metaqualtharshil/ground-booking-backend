const express = require('express');
const groundController = require('../controller/groundController');
const authController = require('../controller/authController');
const upload = require('../utils/cloudnary');
const router = express.Router();


router.route('/').get(authController.protect,groundController.getGrounds).post(authController.protect,upload.array("photos",5),groundController.addGround);

router.route("/:id")
        .get(authController.protect,groundController.getGround) 
        .patch(authController.protect,groundController.updateGround) 
        .delete(authController.protect,groundController.deleteGround);

module.exports = router;