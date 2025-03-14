"use client";

import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet.");
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/Payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md max-w-md mx-auto py-10">
      <PaymentElement />
      {errorMessage && <div>{errorMessage}</div>}
      <button
        disabled={!stripe || loading}
        className="text-white p-5 w-full bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? ` Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;
