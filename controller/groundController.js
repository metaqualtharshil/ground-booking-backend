const catchAsync = require("../utils/catchAsync");
const factory = require("../controller/handleFactory");
const Ground = require("../model/groundModel");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.getGrounds = factory.getAll(Ground);

exports.getGround = factory.getOne(Ground);

exports.addGround = factory.createOne(Ground);

exports.updateGround = factory.updateOne(Ground);

exports.deleteGround = catchAsync(async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);
    // 1. Delete photos from Cloudinary (if any)
    // if (ground.photos && ground.photos.length > 0) {
    //   for (const photoUrl of ground.photos) {
    //     const publicId = `${photoUrl.split("/")[7].split(".")[0]}/${
    //       photoUrl.split("/")[8].split(".")[0]
    //     }`;
    //     const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);

    //     console.log("Cloudinary response:", cloudinaryResponse);

    //     // Check if Cloudinary returns an error
    //     if (cloudinaryResponse.result !== "ok") {
    //       throw new Error(`Failed to delete image with public ID: ${publicId}`);
    //     }
    //   }
    // }

    const doc = await Ground.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
});
