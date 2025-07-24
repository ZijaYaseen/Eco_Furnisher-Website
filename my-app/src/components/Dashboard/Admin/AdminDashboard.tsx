"use client"
import {  useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import StatsCards from './StatsCards';
import SalesChart from './SalesChart';
import ProductsTable from './ProductsTable';
import OrdersTable from './OrdersTable';
import UsersTable from './UsersTable';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-100 text-black">
      {/* Sidebar: fixed on all screens, overlays on mobile */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Main content area with left margin for sidebar */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar always at the top of content (all screens) */}
        <div className="sticky top-0 z-[70] bg-white">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
        </div>
        {/* Main dashboard content */}
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 flex-1 mt-6">
          {activeTab === "dashboard" && 
          <div>
            <StatsCards />
             <SalesChart />
          </div> 
          }
          {activeTab === 'products' && <ProductsTable />}
          {activeTab === 'orders' && <OrdersTable />}
          {activeTab === 'users' && <UsersTable />}
        </div>
      </div>
    </div>
  );
} 