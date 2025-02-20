const express = require("express");
const AppError = require("./utils/appError");
const logToFile = require("./utils/cronJobTxt");
const Booking = require("./model/bookingModel");
const userRoutes = require("./routes/userRoutes");
const groundRoutes = require("./routes/groundRoutes");
const {booking , bookingAdmin} = require("./routes/bookingRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const offerRoutes = require("./routes/offerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const coachingRoutes = require("./routes/coachingRoutes");
const app = express();
const bodyParser = require("body-parser");
const gloableErrorHandler = require("./controller/errorController");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit"); // brute atteck saviour
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cron = require("node-cron");
const multer = require("multer");
const morgan = require("morgan");

const upload = multer();
// app.use(upload.none());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); 
app.use(helmet()); //set security HTTP header

//data sanitization against nosql query injection like this email:{"$gt":""}
app.use(mongoSanitize());

app.use("/img", express.static("public/img"));

//data sanitization against xss when we put html code in body then convert html tag
app.use(xss());

//prevent parameter pollution in querystring remove duplicate fields tour?sort=duration&sort=name
app.use(hpp());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.header);
  next();
});

// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/ground", groundRoutes);
app.use("/api/v1/booking", booking);
app.use("/api/v1/admin/booking", bookingAdmin);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/offer", offerRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/coaching", coachingRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!!`, 404));
});

app.use(gloableErrorHandler);

cron.schedule("*/5 * * * *", async () => {
  // every 5 min */5 * * * *  , * * * * *
  const currentDate = new Date(); // Get current date and time
  // console.log(Date(currentDate.toISOString())); // Output will be in ISO format
  currentDate.setHours(currentDate.getHours() + 5); // Add 5 hours
  currentDate.setMinutes(currentDate.getMinutes() + 30); // Add 30 minutes
  console.log(currentDate.toISOString()); // Output will be in ISO format
  try {
    // Update bookings whose slot.endTime has passed
    const result = await Booking.updateMany(
      {
        status: "Confirmed",
        "slot.endTime": { $lt: currentDate.toISOString() },
      },
      {
        $set: { status: "Completed" },
      }
    );

    console.log(`Status updated for ${result.modifiedCount} bookings`);
    // logToFile(`Status updated for ${result.modifiedCount} bookings`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
