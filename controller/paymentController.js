const Payment = require("../model/paymentModel");
const factory = require("../controller/handleFactory");
const catchAsync = require("../utils/catchAsync");
const Ground = require("../model/groundModel");
const Booking = require("../model/bookingModel");

exports.addPayment = factory.createOne(Payment);

exports.getPayment = factory.getAll(Payment);

exports.updatePayment = factory.updateOne(Payment);

exports.deletePayment = factory.deleteOne(Payment);

exports.getTotalRevenue = catchAsync(async (req, res) => {
  const adminGrounds = await Ground.find({ addedBy: req.user.id });

  if (!adminGrounds) {
    return res.status(400).json({
      success: false,
      message: "No grounds found for this admin",
    });
  }

  const groundId = adminGrounds.map((ground) => ground._id);

  const adminBooking = await Booking.find({ groundId: groundId });

  if (!adminBooking) {
    return res.status(400).json({
      success: false,
      message: "No BOOKING found for this admin",
    });
  }
//   console.log(adminBooking);

  const bookingIds = adminBooking.map((booking) => booking._id);

  //   const totalrevenue = await Payment.find({ bookingId: { $in : bookingIds} });

  const totalrevenue = await Payment.aggregate([
    {
      $match: { bookingId: { $in: bookingIds } },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    totalAmount: totalrevenue[0].totalAmount,
  });
});

exports.getPaymentListAdmin = catchAsync(async(req,res)=>{
  const adminGrounds = await Ground.find({ addedBy: req.user.id });

  if (!adminGrounds) {
    return res.status(400).json({
      success: false,
      message: "No grounds found for this admin",
    });
  }

  const groundId = adminGrounds.map((ground) => ground._id);

  const adminBooking = await Booking.find({ groundId: groundId });

  if (!adminBooking) {
    return res.status(400).json({
      success: false,
      message: "No BOOKING found for this admin",
    });
  }
//   console.log(adminBooking);

  const bookingIds = adminBooking.map((booking) => booking._id);

  const paymentList = await Payment.find({ bookingId: { $in : bookingIds} });

  res.status(200).json({
    success: true,
    data: paymentList,
  });
});
