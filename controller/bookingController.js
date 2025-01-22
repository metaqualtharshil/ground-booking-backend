const factory = require("../controller/handleFactory");
const Booking = require("../model/bookingModel");
const Ground = require("../model/groundModel");
const catchAsync = require("../utils/catchAsync");

exports.addBooking = catchAsync(async (req, res, next) => {
//   const groundSlot = await Ground.find({
//     "availableSport.availableSlots._id": req.body.slot.slotId,
//   });
  Ground.updateOne(
    { "availableSport.availableSlots._id": req.body.slot.slotId },
    {
      $set: {
        "availableSport.$.availableSlots.$[elem].status": "booked",
        "availableSport.$.availableSlots.$[elem].bookedBy": req.body.userId,
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

exports.getUserBooking = catchAsync(async(req,res,next)=>{
    const Id = req.params.userId;
    const bookingList = await Booking.find({userId: Id});
    
    res.status(200).json({
        status: "success",
        total: bookingList.length,
        data: bookingList,
      });
});

exports.getBooking = factory.getAll(Booking);

exports.getOneBooking = factory.getOne(Booking);

exports.updateBooking = factory.updateOne(Booking);

exports.deleteBooking = factory.deleteOne(Booking);
