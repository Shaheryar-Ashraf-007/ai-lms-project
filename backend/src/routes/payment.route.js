import express from "express";
import { createPaymentIntent, verifyPayment } from "../controllers/orderController.js";


const router = express.Router();

// ✅ Create Payment Intent (User clicks "Buy Course")
router.post("/create-payment-intent", createPaymentIntent);

// ✅ Verify Payment (After successful Stripe payment)
router.post("/verify-payment", verifyPayment);

export default router;