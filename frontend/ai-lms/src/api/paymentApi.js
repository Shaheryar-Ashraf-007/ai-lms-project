import axiosInstance from "../../lib/axiosInstance.js";

// ✅ Base API instance (you can reuse this)


// ✅ Create Payment Intent
export const createPaymentIntent = async ({ courseId, userId }) => {
  try {
    const { data } = await axiosInstance.post("/payment/create-payment-intent", {
      courseId,
      userId,
    });

    return data;
  } catch (error) {
    console.error("Create Payment Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

// ✅ Verify Payment
export const verifyPayment = async ({ paymentIntentId }) => {
  try {
    const { data } = await axiosInstance.post("/payment/verify-payment", {
      paymentIntentId,
    });

    return data;
  } catch (error) {
    console.error("Verify Payment Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};