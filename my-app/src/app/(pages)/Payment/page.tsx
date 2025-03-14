"use client";

import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ConvertToSubcurrency from "@/lib/convertoSubcurrency";
import CheckoutPage from "@/components/CheckoutPage";
import { UseAppSelector } from "@/redux/hooks";
import PagesHeader from "@/components/PagesHeader";
import axios from "axios";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is undefined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const cartItems = UseAppSelector((state) => state.cart.items);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + (item.subtotal || 0),
    0
  );
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch clientSecret from your API after calculating the cart total
  useEffect(() => {
    if (cartTotal > 0) {
      // Convert the cartTotal to cents if needed (using your conversion function)
      const amountInCents = ConvertToSubcurrency(cartTotal);
      axios
        .post(
          "/api/payment",
          { amount: amountInCents },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          console.log("Payment API response:", res.data);
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
          console.error("Error fetching client secret:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [cartTotal]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!clientSecret) {
    return <div>Error: Unable to generate payment intent.</div>;
  }

  // Only pass clientSecret in the options
  const elementsOptions = { clientSecret };

  return (
    <main className="lg:mt-[90px] mt-[60px]">
      <PagesHeader name="Payment" title="Payment" />
      <Elements stripe={stripePromise} options={elementsOptions}>
        <CheckoutPage amount={cartTotal} />
      </Elements>
    </main>
  );
};

export default PaymentPage;
