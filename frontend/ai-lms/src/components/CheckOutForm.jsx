import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent, verifyPayment } from "../api/paymentApi.js";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ courseId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Get user data from userSlice
  const userData = useSelector((state) => state.user.userData);
  const userId = userData?._id;

  if (!userId) {
    return <p>Please login to proceed with payment</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      // Step 1: Create Payment Intent
      const res = await createPaymentIntent({ courseId, userId });
      const clientSecret = res.clientSecret;

      // Step 2: Confirm Card Payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Step 3: Verify Payment on Backend
      await verifyPayment({
        paymentIntentId: paymentIntent.id,
        courseId,
        userId,
      });

      // Step 4: Redirect to success page
      navigate("/payment-success");
    } catch (err) {
      console.error(err);
      setError(err.message || "Payment failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Complete Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Input */}
        <div className="p-3 border rounded-lg">
          <CardElement
            options={{
              style: {
                base: { fontSize: "16px", color: "#32325d" },
              },
            }}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Pay Button */}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;