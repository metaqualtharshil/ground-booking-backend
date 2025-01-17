const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    bookingId: {
      type: mongoose.Schema.ObjectId,
      ref: "Booking",
    },
    amount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "UPI", "Wallet"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Success", "Failed", "Pending"],
    },
    transactionId: {
      type: String,
      required: [true, "transactionId is required."],
    },
  },
  {
    timestamps: true,
  }
);

const payment = mongoose.model("Payment", paymentSchema);

module.exports = payment;
