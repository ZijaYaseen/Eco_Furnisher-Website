import React from "react";

const navItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "products", label: "Products" },
  { key: "orders", label: "Orders" },
  { key: "users", label: "Users" },
];

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <aside className="w-64 min-h-screen bg-black text-white flex flex-col py-8 px-4">
      <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
      <nav className="flex-1">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                className={`w-full text-left px-4 py-2 rounded transition font-semibold ${activeTab === item.key ? "bg-white text-black" : "hover:bg-gray-800"}`}
                onClick={() => setActiveTab(item.key)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button className="mt-8 px-4 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 transition">Logout</button>
    </aside>
  );
} 