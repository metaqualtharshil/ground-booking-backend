const express = require("express");
const AppError = require("./utils/appError");
const userRoutes = require("./routes/userRoutes");
const groundRoutes = require("./routes/groundRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const app = express();
const bodyParser = require("body-parser");
const gloableErrorHandler = require("./controller/errorController");
const helmet=require('helmet');  
const rateLimit=require('express-rate-limit'); // brute atteck saviour
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet());  //set security HTTP header

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
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
app.use("/api/v1/ground",groundRoutes);
app.use("/api/v1/booking",bookingRoutes);
app.use("/api/v1/banner",bannerRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!!`, 404));
});

app.use(gloableErrorHandler);

module.exports = app;
