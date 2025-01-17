const factory = require("../controller/handleFactory");
const Banner = require("../model/bannerModel");


exports.getBanner = factory.getAll(Banner);

exports.getOneBanner = factory.getOne(Banner);

exports.addBanner = factory.createOne(Banner);

exports.updateBanner = factory.updateOne(Banner);

exports.deleteBanner = factory.deleteOne(Banner);