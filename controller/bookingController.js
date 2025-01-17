const factory = require("../controller/handleFactory");
const Booking = require("../model/bookingModel");


exports.addBooking = factory.createOne(Booking); 

exports.getBooking = factory.getAll(Booking); 

exports.getOneBooking = factory.getOne(Booking); 

exports.updateBooking = factory.updateOne(Booking); 

exports.deleteBooking = factory.deleteOne(Booking); 