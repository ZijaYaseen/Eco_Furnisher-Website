"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import Success from "@/components/success";

const PaymentSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div>
      <Success title="Payment Successful! 🎉" description="Thank you for your payment. Your transaction was successful."/>
    </div>
  );
};

export default PaymentSuccess;
