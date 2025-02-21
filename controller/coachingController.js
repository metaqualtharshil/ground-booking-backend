const Coaching = require("../model/coachingModel");
const factory = require("../controller/handleFactory");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const deleteImage = require("../utils/deleteImage");
const AppError = require("../utils/appError");

//  http://localhost:4000/img/coaching/coaching-677d0c6063b71f7164515238-1737984441367-1.jpeg

// Configure Multer Storage (in memory for Sharp processing)
const multerStorage = multer.memoryStorage(); // Store files in memory as buffers

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image please only upload image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.array("photos", 5);

exports.resizeCoachingImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  //1)images
  req.body.photos = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `coaching-${req.user.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/coaching/${filename}`);

      req.body.photos.push(filename);
    })
  );
  next();
});

exports.addCoaching = async (req, res, next) => {
  try {
    const newDoc = await Coaching.create(req.body);
    res.status(201).json({
      status: "success",
      data: newDoc,
    });
  } catch (error) {
    console.error("Error during file upload:", error); // Log error details for debugging
    res.status(500).json({
      message: "Failed to upload ground photos.",
      error: error.message || "Internal Server Error",
    });
  }
};

exports.getCoaching = factory.getOne(Coaching);

exports.getAllCoaching = factory.getAll(Coaching);

exports.updateCoaching = catchAsync(async (req, res, next) => {
  const coaching = await Coaching.findById(req.params.id);
  if (!coaching) {
    return next(new AppError("No booking found for this id", 404));
  }

  // Get images to keep
  let imagesToKeep = req.body.imagesToKeep || [];
  // Delete images NOT in the keep list filter function return new array
  coaching.photos = coaching.photos.filter((filename) => {
    if (!imagesToKeep.includes(filename)) {
      deleteImage("coaching", filename); // Delete image file
      return false;
    }
    return true;
  });
  req.body.photos = coaching.photos;

  // 2. Delete old images if new files are provided
  if (req.files && req.files.length > 0) {
    //1)images
    let newImages = [];

    await Promise.all(
      req.files.map(async (file, i) => {
        const filename = `coaching-${req.user.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/coaching/${filename}`);

        newImages.push(filename);
      })
    );
    req.body.photos = [...coaching.photos, ...newImages]; // Keep old & new images
  }

  const doc = await Coaching.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true, //if false then model validator not use if we true then use
  });

  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.deleteCoaching = catchAsync(async (req, res, next) => {
  const doc = await Coaching.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError("No coaching found for this  id", 404));
  }

  // 2. Delete images associated with the coaching
  if (doc.photos && doc.photos.length > 0) {
    doc.photos.forEach((photoUrl) => {
      deleteImage("coaching", photoUrl);
    });
  }

  res.status(204).json({
    status: "success",
    data: {},
  });
});

exports.getAdminCoaching = catchAsync(async (req, res) => {
  const coaching = await Coaching.find({ addedBy: req.user.id });

  if (!coaching) {
    return res.status(400).json({
      success: false,
      message: "No coaching found for this admin",
    });
  }

  res.status(200).json({
    status: "success",
    result: coaching.length,
    data: coaching,
  });
});
