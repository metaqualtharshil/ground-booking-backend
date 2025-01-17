const catchAsync = require("../utils/catchAsync");
const factory = require("../controller/handleFactory");
const Ground = require("../model/groundModel");


exports.getGrounds = factory.getAll(Ground);

exports.getGround = factory.getOne(Ground);

exports.addGround = factory.createOne(Ground);

exports.updateGround = factory.updateOne(Ground);

exports.deleteGround = factory.deleteOne(Ground);