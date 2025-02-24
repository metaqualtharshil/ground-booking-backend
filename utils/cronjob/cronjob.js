const logToFile = require("../cronJobTxt");
const cron = require("node-cron");
const Booking = require("../../model/bookingModel");

const scheduleJobs = () => {
  cron.schedule("*/5 * * * *", async () => {
    // every 5 min */5 * * * *  , * * * * *
    const currentDate = new Date(); // Get current date and time
    currentDate.setHours(currentDate.getHours() + 5); 
    currentDate.setMinutes(currentDate.getMinutes() + 30); 
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

  cron.schedule("*/10 * * * *", async () => {
    // Runs every 10 minutes
    console.log("Running auto-rejection cron job...");

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    // Find all pending bookings that belong to grounds with "manual" acceptance
    const pendingBookings = await Booking.find({
      status: "Pending",
      createdAt: { $lte: oneHourAgo },
    }).populate("groundId");

    const bookingsToReject = pendingBookings.filter(
      (booking) => booking.groundId.acceptanceType === "manual"
    );

    if (bookingsToReject.length > 0) {
      await Booking.updateMany(
        { _id: { $in: bookingsToReject.map((b) => b._id) } },
        { $set: { status: "Cancelled" } }
      );

      console.log(`${bookingsToReject.length} bookings auto-rejected.`);
      logToFile(`${bookingsToReject.length} bookings auto-rejected.`);
    } else {
      console.log("No pending bookings to reject.");
    }
  });
};

module.exports = scheduleJobs;
