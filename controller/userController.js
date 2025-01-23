const catchAsync = require("../utils/catchAsync");
const User = require("../model/userModel");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
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
  const filterBody = filterObj(req.body, "name", "phone", "country", "city");
  if (req.file) filterBody.photo = req.file.path;

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


exports.addFavorite = catchAsync(async (req,res,next)=>{
  
});
