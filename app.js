const express = require("express");
const AppError = require("./utils/appError");
const Booking = require("./model/bookingModel");
const userRoutes = require("./routes/userRoutes");
const groundRoutes = require("./routes/groundRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
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
const morgan = require('morgan');

// app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();
// app.use(upload.none());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet()); //set security HTTP header

//data sanitization against nosql query injection like this email:{"$gt":""}
app.use(mongoSanitize());

app.use('/img', express.static('public/img'));

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
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/offer", offerRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/coaching", coachingRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!!`, 404));
});

// app.use(gloableErrorHandler);

// cron.schedule("* * * * *", async () => {
//   const now = new Date();
//   console.log(now);
//   try {
//     const bookings = await Booking.find({ status: "Confirmed" });

//     bookings.forEach(async (booking) => {
//       const startTime = new Date(booking.slot.startTime);
//       const endTime = new Date(booking.slot.endTime);
//       console.log(`end time :: ${endTime}`);

//       if (startTime <= now) {
//         booking.status = "In Progress";
//         await booking.save();
//       } else if (endTime <= now) {
//         booking.status = "Completed";
//         await booking.save();
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = app;
