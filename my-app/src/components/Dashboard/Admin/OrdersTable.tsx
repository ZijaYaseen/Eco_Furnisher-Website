import React from 'react';

interface Order {
  _id: string;
  createdAt: string;
  orderStatus: string;
  trackingStatus: string;
  trackingNumber?: string;
  orderTotal: number;
  shippingCost: number;
  taxAmount: number;
  paymentMethod: string;
  orderItems: any[];
}

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
      <div className="font-bold text-lg text-black mb-4">Orders</div>
      <div className="text-gray-400">Order management UI will appear here.</div>
    </div>
  );
} 