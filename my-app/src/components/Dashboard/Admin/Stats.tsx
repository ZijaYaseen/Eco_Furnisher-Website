import React from "react";

export default function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-black text-white rounded-lg p-6 flex flex-col items-center">
        <span className="text-3xl font-bold">$12,345</span>
        <span className="mt-2">Total Sales</span>
      </div>
      <div className="bg-black text-white rounded-lg p-6 flex flex-col items-center">
        <span className="text-3xl font-bold">120</span>
        <span className="mt-2">Orders</span>
      </div>
      <div className="bg-black text-white rounded-lg p-6 flex flex-col items-center">
        <span className="text-3xl font-bold">56</span>
        <span className="mt-2">Products</span>
      </div>
      <div className="bg-black text-white rounded-lg p-6 flex flex-col items-center">
        <span className="text-3xl font-bold">8</span>
        <span className="mt-2">Users</span>
      </div>
    </div>
  );
} 