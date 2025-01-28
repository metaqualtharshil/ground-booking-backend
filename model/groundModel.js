const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Date of the slot
  startTime: { type: Date, required: true }, // Start time of the slot
  endTime: { type: Date, required: true }, // End time of the slot
  price: Number,
  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available", // Default status is "available"
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who booked the slot
    default: null, // Null when the slot is available
  },
});

const priceChart = new mongoose.Schema({
  heading: {
    type: String,
    required: [true, "price Chart is required."],
  },
  slot: {
    type: [String],
    required: [true, "slot is required."],
  },
  price: {
    type: Number,
    required: [true, "price is required."],
  },
});

const groundSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
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
    availableTime: {
      type: String,
      default: "24 hrs",
    },
    availableSport: [
      {
        icon: String,
        name: String, // cricket, football
        groundName: [
          {
            name: String,
            availableSlots: [slotSchema],
            priceChart: [priceChart],
          },
        ], // turf 1 , turf 2
      },
    ],
    totalGround: {
      type: Number,
      default: 1,
    },
    photos: { type: [String], default: [] },
    rating: {
      stars: { type: Number, default: 0 }, // e.g., 1 to 5 stars
      review: String, // Optional text review from the user
      ratedAt: Date, // When the rating was submitted
    },
    aboutVenue: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ground = mongoose.model("Ground", groundSchema);

module.exports = ground;
