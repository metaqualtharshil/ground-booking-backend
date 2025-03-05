const catchAsync = require("../utils/catchAsync");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/email");
const sendOTP = require("../utils/twilio");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

async function generateUniqueReferralCode() {
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a random 8-char code
    const existingUser = await User.findOne({ referralCode: code });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return code;
}

exports.signUp = catchAsync(async (req, res) => {
  console.log(req.body);

  const referralCode = await generateUniqueReferralCode();

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    referralCode: referralCode,
    city: req.body.city,
    countryCode: req.body.countryCode,
    referredBy: req.body.referredBy,
  });

  const token = signToken(newUser._id);
  const { password: _, ...userWithoutPassword } = newUser.toObject();

  res.status(200).json({
    status: "success",
    token: token,
    requestedAt: req.requestTime,
    data: {
      user: userWithoutPassword,
    },
  });
});

exports.generateOtp = catchAsync(async (req, res, next) => {
  const { phone, email } = req.body;
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    alphabets: false,
    specialChars: false,
  });
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  } else {
    user.otp = otp;
    user.otpExpiry = otpExpiry;
  }

  await user.save({ validateBeforeSave: false });

  // Send OTP via SMS or Email (Using Twilio or Nodemailer)
  // sendOTP(phone, otp);
  console.log(`OTP for ${phone || email}: ${otp}`); // Debugging

  res.status(200).json({ message: "OTP sent successfully" });
});

exports.verifyOtp = catchAsync(async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  // Check OTP validity
  if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
    return res
      .status(200)
      .json({ status: "false", message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "OTP verified successfully",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;

  // if (!email || !password) {
  //   return next(new AppError("Please provide phone and password", 400));
  // }

  // const user = await User.findOne({ phone }).select("+password");

  // if (!user || !(await user.correctPassword(password, user.password))) {
  //   return next(new AppError("Incorrect email or password", 401));
  // }

  const user = await User.findOne({ phone, isVerified: true });

  if (!user) {
    return res.status(400).json({ message: "User not found or not verified" });
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    userId: user.id,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of its exist
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logging in! Please log in to get access.", 401)
    );
  }
  //2) verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer", 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPassword(decode.iat)) {
    return next(
      new AppError("user recently changed password ,please log in again", 401)
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE

  req.user = currentUser;
  next();
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1) get the user based on email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("there is no user with email address", 404));
  }

  // 2) generate the random resest token
  const resetToken = user.createPasswordResetToken();
  await User.updateOne(
    { email: req.body.email },
    {
      $set: {
        passwordResetToken: crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex"),
      },
    }
  );
  // await user.save({validateBeforeSave : false});  // deactivate all schema validator

  //3) send it to user's email

  const resetURl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/reserPassword/${resetToken}`;
  console.log(resetURl);
  const message = `forget your password? submit new passwore with patch request and passwordconfirm to: ${resetURl}.
      \n if ypu dont forget password then ignore this email!!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset token (valid 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "there was error sending email please send after some time!!",
        404
      )
    );
  }
});

exports.resetPassowrd = catchAsync(async (req, res, next) => {
  // 1) get user based on token
  const hasedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(hasedToken);
  const user = await User.findOne({
    passwordResetToken: hasedToken,
    // passwordResetExpires: { $gt: Date.now() },
  });

  //2) if token has not expired,and there is user set new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.otp = undefined; // Clear OTP after password reset
  user.otpExpiry = undefined;
  await user.save();

  //3) update changepasswordAt property for the user

  //4) log these user in,send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("your current password id wrong!"), 401);
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
