// razorpayService.js
import api from "./api/apiService";

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const formatTime = (date) => {
  return date.toTimeString().split(" ")[0];
};

export const initiateRazorpayPayment = async (
  userId,
  dependentsIds,
  bookingId,
  totalAmount,
  onSuccess,
  onFailure,
  patientName,
  email,
  phoneNumber
) => {
  try {
    // Create the payment order on your server
    const response = await api.post("/payment/create", {
      userId,
      bookingId,
      dependents: dependentsIds,
      totalAmount,
    });

    const { razorpayOrder, paymentId } = response.data;

    const options = {
      key: "rzp_test_LRJCuoouzxFBSv",
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "CheckMed",
      description: "Offsite Collection Payment",
      order_id: razorpayOrder.id,
      handler: async function (response) {
        const paymentData = {
          paymentId,
          razorpayPaymentId: response.razorpay_payment_id,
          signatureId: response.razorpay_signature,
          orderId: response.razorpay_order_id,
          status: "completed",
          timeOfPay: formatTime(new Date()),
          dateOfPay: formatDate(new Date()),
        };

        try {
          // Update payment status on your server
          await api.post("/payment/update", paymentData);
          onSuccess();
        } catch (error) {
          console.error("Error updating payment:", error);
          onFailure("Payment verification failed. Please contact support.");
        }
      },
      modal: {
        ondismiss: function () {
          onFailure("Payment was cancelled.");
        },
      },
      prefill: {
        name: patientName || "CheckMed Customer",
        email: email || "customer@example.com",
        contact: phoneNumber || "9999999999",
      },
      theme: {
        color: "#0e797f",
      },
    };

    // Ensure Razorpay script is loaded
    if (typeof window.Razorpay === "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      };
      script.onerror = () => {
        onFailure("Failed to load Razorpay SDK. Please try again.");
      };
      document.body.appendChild(script);
    } else {
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    }
  } catch (error) {
    console.error("Razorpay Payment Failed", error);
    onFailure("Failed to initiate payment. Please try again.");
  }
};
