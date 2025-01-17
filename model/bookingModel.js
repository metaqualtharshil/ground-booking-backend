const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    groundId: {
      type: mongoose.Schema.ObjectId,
      ref: "Ground",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      unique: true,
      default: Date.now(),
    },
    slot: {
      startTime: "String", // e.g., "09:00"
      endTime: "String", // e.g., "10:00"
    },
    status: {
      type: String,
      enum:["Pending", "Confirmed", "Cancelled"],
      default: "Pending"
    },
    totalAmount:{
        type: Number,
        required: [true,'TotalAmount is required.']
    },
    paymentId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Payment'
    }
  },
  {
    timestamps: true,
  }
);

const booking = mongoose.model("Booking", bookingSchema);

module.exports = booking;
