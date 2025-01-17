const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
      minlength: 10,
      maxlength: 10,
    },
    favorites: [
      {
        groundId: mongoose.Schema.ObjectId,
        addedAt: Date
      },
    ],
    referralCode: {
      type: String, // Unique code for each user
      unique: true,
      required: [true, "A referralCode is required."],
    },
    referredBy: {
      type: String, // Referral code used by this user
    },
    rewardBalance: {
      type: Number, // Credits or discounts earned
      default: 0,
    },
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

userSchema.pre("save", async function (req, res, next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  // next();
});

userSchema.methods.correctPassword = async function (candidatepass, userPass) {
  return await bcrypt.compare(candidatepass, userPass);
};

const user = mongoose.model("User", userSchema);

module.exports = user;
