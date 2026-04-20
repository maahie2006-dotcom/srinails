import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Ensure env variables are loaded
dotenv.config();

const router = express.Router();

// Initialize Razorpay with your Test Keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * STEP 1: CREATE ORDER
 * This happens when the user clicks the "Checkout" button.
 */
router.post("/orders", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay works in paise (Rupees * 100)
      currency: "INR",
      receipt: `receipt_srinails_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Send the order details to the frontend
    res.status(200).json(order);

  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * STEP 2: VERIFY PAYMENT
 * This happens after the user completes the payment in the Razorpay popup.
 */
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create the expected signature using your Secret Key
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Compare the signatures
    if (razorpay_signature === expectedSignature) {
      return res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully!" 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature. Potential fraud attempt." 
      });
    }

  } catch (error) {
    console.error("VERIFICATION ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;