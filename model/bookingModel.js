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
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    totalAmount: {
      type: Number,
      required: [true, "TotalAmount is required."],
    },
    discountAmount: {
      type: Number,
      default:0
    },
    usedReward: {
      type:Boolean,
      default: false
    }, // If referral or reward credits were applied
    appliedOffer: {
      offerId: {
        type: mongoose.Schema.ObjectId,
        ref: "Offer",
      }, // Reference to Offers collection
      offerTitle: String, // Title of the offer applied
      discountValue: Number, // Discount value from the offer
    },
    paymentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Payment",
    },
    isFavorite: Boolean, // If the user marked this ground as a favorite
  },
  {
    timestamps: true,
  }
);

const booking = mongoose.model("Booking", bookingSchema);

module.exports = booking;
