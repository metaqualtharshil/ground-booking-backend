const mongoose = require("mongoose");

const coachingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required."],
    },
    description: {
      type: String,
      required: [true, "description is required."],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    session: {
      type: String,
      required: [true, "session is required."],
    },
    overview: {
      type: String,
      required: [true, "overview is required."],
    },
    phoneNo: {
      type: Number,
      required: [true, "phoneNo is required."],
    },
    photos: { type: [String], default: [] },
    sport: {
      type:  [String],
      required: [true, "Sport type is required."],
      // enum: ["Cricket", "Football", "Tennis", "Badminton", "Other"],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // owner: {
    //   name: { type: String },
    //   experience: { type: Number },
    //   gender:{type:String , enum:['male','female']},
    // },
  },
  {
    timestamps: true,
  }
);

const coaching = mongoose.model("Coaching", coachingSchema);

module.exports = coaching;
