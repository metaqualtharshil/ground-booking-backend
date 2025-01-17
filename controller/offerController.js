const factory = require("../controller/handleFactory");
const Offer = require("../model/offersModel");


exports.addOffer = factory.createOne(Offer);

exports.getOffer = factory.getAll(Offer);

exports.updateOffer = factory.updateOne(Offer);

exports.deleteOffer = factory.deleteOne(Offer);