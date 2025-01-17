const mongoose = require("mongoose");

const bannerSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    url:{
        type:String,
        required:[true,"Banner url is required."]
    }
  },
  {
    timestamps: true,
  }
);

const banner = mongoose.model('Banner',bannerSchema);

module.exports = banner;