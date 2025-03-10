const mongoose = require("mongoose");

const bannerSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    photo: {
      type: String,
      required: [true, "Banner photo is required."],
    },
    priority: {
      type: Number,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const banner = mongoose.model("Banner", bannerSchema);

module.exports = banner;
