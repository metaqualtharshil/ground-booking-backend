const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOTP(phoneNumber, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    console.log("OTP sent successfully! Message SID:", message.sid);
  } catch (error) {
    console.error("Error sending OTP:", error.message);
  }
}

module.exports = sendOTP;
// Generate a random 4-digit OTP
// const otp = Math.floor(1000 + Math.random() * 9000);
// sendOTP("+91XXXXXXXXXX", otp);
