const mongoose = require("mongoose");

const groundSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique:true,
      required: [true, "Name is required."],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    features: { type: [String], default: [] }, // Default to an empty array
    capacity: { type: Number, required: true },
    pricePerHour: { type: Number, default: 600, required: true },
    availableSlots: [
      {
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],
    photos:[String],
    rating: {
      stars: Number, // e.g., 1 to 5 stars
      review: String, // Optional text review from the user
      ratedAt: Date // When the rating was submitted
    },
   
  },
  {
    timestamps: true,
  }
);

const ground = mongoose.model("Ground", groundSchema);

module.exports = ground;
