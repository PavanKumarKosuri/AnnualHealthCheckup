const util = require("util");
const { db } = require("../config/db.config");
const razorpayInstance = require("../config/razorpay.config");
const crypto = require("crypto");

const query = util.promisify(db.query).bind(db);

const generateReceipt = (bookingId) => {
  const prefix = "receipt_";
  const maxBookingIdLength = 32 - 13 - 1;
  const truncatedBookingId = bookingId.slice(0, maxBookingIdLength);
  const timestamp = Date.now();

  return `${prefix}${truncatedBookingId}_${timestamp}`;
};

exports.createPayment = async (req, res) => {
  const { userId, bookingId, dependents, totalAmount } = req.body;

  if (
    !userId ||
    !bookingId ||
    !dependents ||
    !Array.isArray(dependents) ||
    dependents.length === 0 ||
    !totalAmount
  ) {
    return res.status(400).json({
      message:
        "userId, bookingId, dependents (non-empty array), and totalAmount are required.",
    });
  }

  try {
    const receipt = generateReceipt(bookingId);

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: receipt,
    });


    const insertQuery = `
      INSERT INTO payments 
      (user_id, booking_id, dependents, total_amount, payment_status, order_id) 
      VALUES (?, ?, ?, ?, 'pending', ?)
    `;
    const insertValues = [
      userId,
      bookingId,
      JSON.stringify(dependents),
      totalAmount,
      razorpayOrder.id,
    ];

    const results = await query(insertQuery, insertValues);
    const paymentId = results.insertId;

    return res.status(201).json({
      message: "Payment record created successfully",
      paymentId,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Error creating payment:", error);

    return res.status(500).json({
      message: "Failed to create payment record",
      error: error.message,
    });
  }
};

exports.updatePayment = async (req, res) => {
  const {
    paymentId,
    razorpayPaymentId,
    signatureId,
    orderId,
    status,
    timeOfPay,
    dateOfPay,
  } = req.body;

  if (
    !paymentId ||
    !razorpayPaymentId ||
    !signatureId ||
    !orderId ||
    !status ||
    !timeOfPay ||
    !dateOfPay
  ) {
    return res.status(400).json({
      message:
        "paymentId, razorpayPaymentId, signatureId, orderId, status, timeOfPay, and dateOfPay are required.",
    });
  }

  try {
    const payments = await query(`SELECT * FROM payments WHERE id = ?`, [
      paymentId,
    ]);
    const payment = payments[0];

    if (!payment) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }

    const body = orderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", razorpayInstance.key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signatureId) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const updateValues = [
      razorpayPaymentId,
      signatureId,
      orderId,
      status,
      timeOfPay,
      dateOfPay,
      paymentId,
    ];

    const updateResult = await query(
      `UPDATE payments 
       SET razorpay_payment_id = ?, signature_id = ?, order_id = ?, 
           payment_status = ?, time_of_payment = ?, date_of_payment = ? 
       WHERE id = ?`,
      updateValues
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }

    return res.status(200).json({
      message: "Payment updated successfully",
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return res.status(500).json({
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

exports.getPaymentByBookingId = async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return res.status(400).json({
      message: "bookingId is required.",
    });
  }

  try {
    const payments = await query(
      `SELECT * FROM payments WHERE booking_id = ?`,
      [bookingId]
    );
    const payment = payments[0];

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    return res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return res.status(500).json({
      message: "Failed to fetch payment",
      error: error.message,
    });
  }
};

exports.handleRefund = async (req, res) => {
  const { paymentId, refundAmount, refundReason } = req.body;

  if (!paymentId || !refundAmount || !refundReason) {
    return res.status(400).json({
      message: "paymentId, refundAmount, and refundReason are required.",
    });
  }

  try {
    const payments = await query(`SELECT * FROM payments WHERE id = ?`, [
      paymentId,
    ]);
    const payment = payments[0];

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (payment.payment_status !== "completed") {
      return res.status(400).json({
        message: "Only completed payments can be refunded",
      });
    }

    const razorpayRefund = await razorpayInstance.payments.refund(
      payment.razorpay_payment_id,
      {
        amount: refundAmount * 100,
        notes: { refund_reason: refundReason },
      }
    );

    const updateResult = await query(
      `UPDATE payments 
       SET payment_status = 'refunded', refund_amount = ?, refund_reason = ? 
       WHERE id = ?`,
      [refundAmount, refundReason, paymentId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }

    return res.status(200).json({
      message: "Refund processed successfully",
      razorpayRefund,
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    return res.status(500).json({
      message: "Failed to process refund",
      error: error.message,
    });
  }
};
