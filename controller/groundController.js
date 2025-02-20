const catchAsync = require("../utils/catchAsync");
const factory = require("../controller/handleFactory");
const Ground = require("../model/groundModel");
const multer = require("multer");
const sharp = require("sharp");
const mongoose = require("mongoose");
const deleteImage = require("../utils/deleteImage");
const AppError = require("../utils/appError");

// Configure Multer Storage (in memory for Sharp processing)
const multerStorage = multer.memoryStorage(); // Store files in memory as buffers

// const multerFilter = (req, file, cb) => {
//   console.log("File MIME Type:", file.mimetype); // Log MIME type
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image please only upload image", 400), false);
//   }
// };
const multerFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|bmp|webp/; // Allowed image types
  const mimeType = file.mimetype.startsWith("image"); // Check MIME type
  const extName = fileTypes.test(
    file.originalname.split(".").pop().toLowerCase()
  ); // Check extension

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    return cb(
      new AppError("Not an image! Please upload only image files.", 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.array("photos", 5);

exports.resizeGroundImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  //1)images
  req.body.photos = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `ground-${req.user.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/ground/${filename}`);

      req.body.photos.push(filename);
    })
  );
  next();
});

exports.getGrounds = factory.getAll(Ground);

exports.getGround = factory.getOne(Ground);

exports.addGround = factory.createOne(Ground);

exports.updateGround = catchAsync(async (req, res, next) => {
  const ground = await Ground.findById(req.params.id);
  if (!ground) {
    return next(new AppError("No ground found for this id", 404));
  }

  // Get images to keep
  let imagesToKeep = req.body.imagesToKeep || [];
  // Delete images NOT in the keep list filter function return new array
  ground.photos = ground.photos.filter((filename) => {
    if (!imagesToKeep.includes(filename)) {
      deleteImage("ground", filename); // Delete image file
      return false;
    }
    return true;
  });
  req.body.photos = ground.photos;
  // 2. Delete old images if new files are provided
  // if (req.files && req.files.length > 0 && ground.photos.length > 0) {
  //   ground.photos.forEach((filename) => {
  //     deleteImage("ground", filename); // Delete old images
  //   });
  // }
  if (req.files && req.files.length > 0) {
    //1)images
    let newImages = [];

    await Promise.all(
      req.files.map(async (file, i) => {
        const filename = `ground-${req.user.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/ground/${filename}`);

        newImages.push(filename);
      })
    );

    req.body.photos = [...ground.photos, ...newImages]; // Keep old & new images
    // console.log(`old : ${ground.photos}`);
    // console.log(`new : ${newImages}`);
  }

  // const doc = await Ground.findByIdAndUpdate(
  //   req.params.id,
  //   JSON.stringify(req.body),
  //   {
  //     new: true,
  //     runValidators: true, //if false then model validator not use if we true then use
  //   }
  // );
  const doc = await Ground.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.deleteGround = catchAsync(async (req, res) => {
  const ground = await Ground.findById(req.params.id);
  // 2. Delete images associated with the coaching
  if (ground.photos && ground.photos.length > 0) {
    ground.photos.forEach((photoUrl) => {
      deleteImage("ground", photoUrl);
    });
  }

  const doc = await Ground.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllSportsName = catchAsync(async (req, res) => {
  const sportList = await Ground.aggregate([
    { $unwind: "$availableSport" }, // Unwind the availableSport array
    { $group: { _id: null, names: { $addToSet: "$availableSport.name" } } }, // Group and collect unique sport names
    { $project: { _id: 0, names: 1 } }, // Project only the names field
  ]);

  res.status(200).json({
    status: "success",
    data: sportList,
  });
});

exports.getAdminGrounds = catchAsync(async (req, res) => {
  const grounds = await Ground.find({ addedBy: req.user.id });

  if (!grounds) {
    return res.status(400).json({
      success: false,
      message: "No grounds found for this admin",
    });
  }

  res.status(200).json({
    success: true,
    count: grounds.length,
    data: grounds,
  });
});
