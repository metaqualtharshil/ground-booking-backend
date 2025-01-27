const catchAsync = require("../utils/catchAsync");
const User = require("../model/userModel");
const AppError = require("../utils/appError");
const multer=require('multer');
const sharp=require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req,file,cb) =>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }
    else{
        cb(new AppError('Not an image please only upload image',400),false);
    }
}

const upload = multer({
    storage:multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async(req,res,next)=>{
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500,500)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/users/${req.file.filename}`);
        
        next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.body.photo);
  //1) create error if user post passworddata
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "this route is not password update please go to route /updateMyPassword",
        400
      )
    );
  }
  // 2) update user
  const filterBody = filterObj(req.body, "name", "phone", "country", "city","interestedSport","fcmToken");
  if(req.file) filterBody.photo = req.file.filename;

  filterBody.interestedSport = JSON.parse(req.body.interestedSport);
  
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.addFavorite = catchAsync(async (req, res, next) => {});
