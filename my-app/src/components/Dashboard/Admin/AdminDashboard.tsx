import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Stats from "./Stats";
import Products from "./Products";
import Orders from "./Orders";
import Users from "./Users";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "products", label: "Products" },
  { key: "orders", label: "Orders" },
  { key: "users", label: "Users" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 bg-white min-h-screen">
        {activeTab === "dashboard" && <Stats />}
        {activeTab === "products" && <Products />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "users" && <Users />}
      </main>
    </div>
  );
} 