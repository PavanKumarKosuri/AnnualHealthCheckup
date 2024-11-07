const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_LRJCuoouzxFBSv",
  key_secret: "yV1plhfI4PX6Ut4BADCa1wWR",
});

module.exports = razorpayInstance;
