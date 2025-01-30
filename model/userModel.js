const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Please enter name"],
    },
    email: {
      type: String,
      required: ["true", "Please enter email"],
      unique: true,
      lowerCase: true,
      validate: [validator.isEmail, "Please provide valid email"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "A password provide"],
      minlength: 8,
      select: false, // means this field not visible when user get data
    },
    passwordConfirm: {
      type: String,
      validate: function (el) {
        return el === this.password;
      },
      required: [true, "A password are not match"],
    },
    phone: {
      type: String,
      unique:true,
      minlength: 13,
      maxlength: 13,
    },
    otp:{
      type:Number
    },
    otpExpiry:Date,
    isVerified:Boolean,
    isPhoneVerify: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        groundId: mongoose.Schema.ObjectId,
        addedAt: Date,
      },
    ],
    interestedSport: [String],
    city: {
      type: String,
    },
    country: {
      type: String,
      default: "India",
    },
    countryCode: {
      type: String,
      default: "+91",
    },
    photo:String,
    fcmToken:String,
    referralCode: {
      type: String, // Unique code for each user
      unique: true,
    },
    referredBy: {
      type: String, // Referral code used by this user
    },
    rewardBalance: {
      type: Number, // Credits or discounts earned
      default: 0,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false, //field show or not
    },
  },
  {
    timestamps: true, // This enables `createdAt` and `updatedAt`
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (candidatepass, userPass) {
  return await bcrypt.compare(candidatepass, userPass);
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.changedPassword = function (JWTTIME) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTIME < changedTimeStamp;
  }
  return false; // false meant not change
};

userSchema.methods.createPasswordResetToken = function () {
  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and set expiry
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 1 hour from now
  console.log({ resetToken }, this.passwordResetToken, this.passwordResetExpires);
  return resetToken;
};

const user = mongoose.model("User", userSchema);

module.exports = user;
