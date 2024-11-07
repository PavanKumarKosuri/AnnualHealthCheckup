const axios = require("axios");
require("dotenv").config();

const OTP_API_KEY = process.env.OTP_API_KEY;
const OTP_TEMPLATE_NAME = process.env.OTP_TEMPLATE_NAME;

// Send OTP
const sendOTP = async (phoneNumber) => {
  try {
    const url = `https://2factor.in/API/V1/${OTP_API_KEY}/SMS/${phoneNumber}/AUTOGEN/${OTP_TEMPLATE_NAME}`;
    const response = await axios.get(url);
    if (response.data.Status === "Success") {
      return true;
    } else {
      throw new Error("Failed to send OTP.");
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw new Error("Error sending OTP");
  }
};

// Verify OTP
const verifyOTP = async (phoneNumber, otp) => {
  try {
    const url = `https://2factor.in/API/V1/${OTP_API_KEY}/SMS/VERIFY3/${phoneNumber}/${otp}`;
    const response = await axios.get(url);

    if (response.data.Details === "OTP Matched") {
      return true;
    } else {
      throw new Error("Invalid OTP.");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    throw new Error("Invalid OTP");
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};
