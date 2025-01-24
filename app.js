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

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();
app.use(upload.none());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(helmet()); //set security HTTP header

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//data sanitization against nosql query injection like this email:{"$gt":""}
app.use(mongoSanitize());

//data sanitization against xss when we put html code in body then convert html tag
app.use(xss());

//prevent parameter pollution in querystring remove duplicate fields tour?sort=duration&sort=name
app.use(hpp());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.header);
  next();
});

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

app.use(gloableErrorHandler);

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const bookings = await Booking.find({ status: "Confirmed" });

  const startTime = new Date(bookings.slot.startTime);
  const endTime = new Date(bookings.slot.endTime);

  console.log(startTime);
  bookings.forEach(async (booking) => {
    if (startTime <= now) {
      booking.status = "In Progress";
      await booking.save();
    } 
    else if (endTime <= now) {
      booking.status = "Completed";
      await booking.save();
    }
  });
});

module.exports = app;
