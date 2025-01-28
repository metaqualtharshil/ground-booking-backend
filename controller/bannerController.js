const factory = require("../controller/handleFactory");
const Banner = require("../model/bannerModel");
const multer = require("multer");
const sharp = require("sharp");
const deleteImage = require("../utils/deleteImage");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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

exports.uploadBannerPhoto = upload.single("photo");

exports.resizeBannerPhoto = catchAsync(async (req, res, next) => {
    
  if (!req.file) return next();

  const bannerInfo = await Banner.findById(req.params.id);
  if (bannerInfo.photo !== "") deleteImage("banner", bannerInfo.photo);

  req.file.filename = `banner-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/banner/${req.file.filename}`);

    req.body.photo = req.file.filename;
  next();
});

exports.getBanner = factory.getAll(Banner);

exports.getOneBanner = factory.getOne(Banner);

exports.addBanner = factory.createOne(Banner);

exports.updateBanner = factory.updateOne(Banner);

exports.deleteBanner = factory.deleteOne(Banner);