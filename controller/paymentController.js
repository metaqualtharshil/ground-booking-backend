const Payment = require("../model/paymentModel");
const factory = require("../controller/handleFactory");

exports.addPayment = factory.createOne(Payment);

exports.getPayment = factory.getAll(Payment);

exports.updatePayment = factory.updateOne(Payment);

exports.deletePayment = factory.deleteOne(Payment);