import React from "react";

export default function Products() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">Add Product</button>
      </div>
      <div className="bg-gray-100 text-black rounded-lg p-6 text-center">
        Product list will appear here.
      </div>
    </div>
  );
} 