const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Date of the slot
  startTime: { type: Date, required: true }, // Start time of the slot
  endTime: { type: Date, required: true, index: { expires: "10d" } }, // End time of the slot
  price: { type: Number, default: 0 },
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

// const priceChart = new mongoose.Schema({
//   heading: {
//     type: String,
//     required: [true, "price Chart is required."],
//   },
//   slot: {
//     type: [String],
//     required: [true, "slot is required."],
//   },
//   price: {
//     type: Number,
//     required: [true, "price is required."],
//   },
// });

const priceChart = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["morning", "afternoon", "evening", "night"],
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  price: { type: Number, required: true },
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
      country: { type: String, default: "India" },
      latitude: { type: Number },
      longitude: { type: Number },
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
            name: String, // turf 1
            availableSlots: [slotSchema],
            priceChart: [priceChart],
            groundDetails: {
              height: { type: Number },
              width: { type: Number },
            },
          },
        ], // turf 1 , turf 2
      },
    ],
    totalGround: {
      type: Number,
      default: 1,
    },
    acceptanceType: {
      type: String,
      enum: ["auto", "manual"],
      default: "manual",
    },
    photos: { type: [String], default: [] },
    rating: {
      type: [
        {
          stars: { type: Number, min: 1, max: 5 },
          review: { type: String },
          reviewBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          ratedAt: { type: Date },
        },
      ],
      default: function () {
        return [];
      },
    },
    aboutVenue: {
      type: String,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ground = mongoose.model("Ground", groundSchema);

module.exports = ground;
