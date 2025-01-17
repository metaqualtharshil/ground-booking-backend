const mongoose = require("mongoose");

const offerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Offer title is required."]
    }, // e.g., "Flat 20% off on weekends"
    description: String, 
    discountType: {
      type: String,
      enum: ["Flat", "Percentage"],
    },
    discountValue: {
      type: Number,
      default: 0,
    }, 
    conditions: String, // Conditions to apply the offer
    validFrom: Date, // Start date of the offer
    validTill: Date, // Expiry date of the offer
  },
  {
    timestamps: true,
  }
);

const offers = mongoose.model("Offer", offerSchema);

module.exports = offers;
