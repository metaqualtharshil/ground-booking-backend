const factory = require("../controller/handleFactory");
const Booking = require("../model/bookingModel");
const Ground = require("../model/groundModel");
const catchAsync = require("../utils/catchAsync");

exports.addBooking = catchAsync(async (req, res, next) => {
  //   const groundSlot = await Ground.find({
  //     "availableSport.availableSlots._id": req.body.slot.slotId,
  //   });
  Ground.updateOne(
    { "availableSport.groundName.availableSlots._id": req.body.slot.slotId },
    {
      $set: {
        "availableSport.$[].groundName.$[].availableSlots.$[elem].status":"booked",
        "availableSport.$[].groundName.$[].availableSlots.$[elem].bookedBy":req.body.userId,
      },
    },
    {
      arrayFilters: [
        { "elem._id": req.body.slot.slotId }, // Ensure that the correct slot is being updated based on the slotId
      ],
    }
  ).then((result) => {});
  const newDoc = await Booking.create(req.body);
  res.status(201).json({
    status: "success",
    data: newDoc,
  });
});

exports.getUserBooking = catchAsync(async (req, res, next) => {
  const Id = req.params.userId;
  const bookingList = await Booking.find({ userId: Id });

  res.status(200).json({
    status: "success",
    total: bookingList.length,
    data: bookingList,
  });
});

// API to Get All Bookings of Grounds for Admin
exports.getUpcomingBookingForAdmin = catchAsync(async (req, res) => {
  const id = req.user.id;

  // Step 1: Find all grounds added by this admin
  const grounds = await Ground.find({ addedBy: id });

  if (grounds.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "No grounds found for this admin" });
  }

  // Step 2: Get ground IDs
  const groundIds = grounds.map((ground) => ground._id);

  // Step 3: Find all bookings for these grounds
  const bookings = await Booking.find({
    groundId: { $in: groundIds },
    $or: [{ status: "Pending" }, { status: "Confirmed" }],
    "slot.startTime": { $gte: new Date() },
  }); //.populate("groundId");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// API to Get All Bookings of Grounds for Admin
exports.getHistoryBookingForAdmin = catchAsync(async (req, res) => {
  const id = req.user.id;

  // Step 1: Find all grounds added by this admin
  const grounds = await Ground.find({ addedBy: id });

  if (grounds.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "No grounds found for this admin" });
  }

  // Step 2: Get ground IDs
  const groundIds = grounds.map((ground) => ground._id);

  // Step 3: Find all bookings for these grounds
  const bookings = await Booking.find({
    groundId: { $in: groundIds },
    $or: [{ status: "Completed" }, { status: "Cancelled" }],
  }); //.populate("groundId");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

exports.upcomingBooking = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const upcomingBookingList = await Booking.find({
    userId: req.user.id,
    $or: [{ status: "Pending" }, { status: "Confirmed" }],
    "slot.startTime": { $gte: new Date() },
  })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ "slot.startTime": 1 });

  res.status(200).json({
    status: "success",
    total: upcomingBookingList.length,
    data: upcomingBookingList,
  });
});

exports.historyBookingList = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const historyBookingList = await Booking.find({
    userId: req.user.id,
    $or: [{ status: "Completed" }, { status: "Cancelled" }],
    // date: { $lt: new Date() }
  })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    status: "success",
    total: historyBookingList.length,
    data: historyBookingList,
  });
});

exports.getBooking = factory.getAll(Booking);

exports.getOneBooking = factory.getOne(Booking);

exports.updateBooking = factory.updateOne(Booking);

exports.deleteBooking = factory.deleteOne(Booking);
