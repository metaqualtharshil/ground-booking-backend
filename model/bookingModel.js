const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    groundId: {
      type: mongoose.Schema.ObjectId,
      ref: "Ground",
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
      unique: false,
    },
    slot: {
      slotId: {
        type: String,
        required: true,
      },
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },  
    },
    totalDuration: {
      type: Number, // Duration in minutes
      required: true,
      min: 1, // Duration must be positive
      validate: {
        validator: function (value) {
          return value > 0; // Ensure duration is positive
        },
        message: "Total duration must be greater than 0",
      },
    },
    groundDetails: {
      icon: String, // Icon for the ground type
      name: {
        type: String,
        required: true, // e.g., "Football", "Cricket"
      },
      groundName: {
        type: String,
        required: true, // e.g., "Heaven"
      },
      subGroundName: {
        type: String,
        required: true, // e.g., "Turf 1", "Turf 2"
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    cancellationReason:{
      type:String
    },
    totalAmount: {
      type: Number,
      required: [true, "TotalAmount is required."],
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usedReward: {
      type: Boolean,
      default: false,
    }, // If referral or reward credits were applied
    appliedOffer: {
      offerId: {
        type: mongoose.Schema.ObjectId,
        ref: "Offer",
      }, // Reference to Offers collection
      offerTitle: String, // Title of the offer applied
      discountValue: {
        type: Number, // Discount value from the offer
        default: 0,
        min: 0,
      },
    },
    paymentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Payment",
    },
    isFavorite: {
      type: Boolean,
      default: false, // If the user has marked this booking as a favorite
    },
  },
  {
    timestamps: true,
  }
);

const booking = mongoose.model("Booking", bookingSchema);

module.exports = booking;
