import Stripe from "stripe";
import dotenv from "dotenv";
import Course from "../models/CourseModel.js";
import User from "../models/User.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    if (!courseId || !userId) {
      return res.status(400).json({ message: "Course ID and User ID required" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        courseId: course._id.toString(),
        userId: userId.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Verify Payment + Enroll User
export const verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "PaymentIntent ID required" });
    }

    // 🔍 Get payment from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }

    // ✅ Extract metadata
    const { courseId, userId } = paymentIntent.metadata;

    // 🔍 Fetch user & course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({
        success: false,
        message: "User or Course not found",
      });
    }

    // ✅ Enroll user (prevent duplicate)
    if (!user.enrollcources.includes(courseId)) {
      user.enrollcources.push(courseId);
      await user.save();
    }

    // ✅ Add student to course
    if (!course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified & course unlocked 🎉",
    });

  } catch (error) {
    console.error("Verification Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};