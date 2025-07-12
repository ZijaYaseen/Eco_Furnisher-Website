import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import StatsCards from './StatsCards';
import TopChannelsTable from './TopChannelsTable';
import SalesChart from './SalesChart';
import ProductsTable from './ProductsTable';
import OrdersTable from './OrdersTable';
import UsersTable from './UsersTable';
import { FiMenu } from 'react-icons/fi';
import type { Order } from './OrdersTable';

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
        {/* Hamburger for mobile */}
        <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 flex items-center h-14 px-4 shadow-sm">
          <button
            className="text-2xl mr-4"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FiMenu />
          </button>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        {/* Topbar always at the top of content */}
        <div className="sticky top-0 z-20 bg-white">
          <Topbar />
        </div>
        {/* Main dashboard content */}
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 flex-1">
          <StatsCards />
          <SalesChart />
          {activeTab === 'dashboard' && (
            <div className="my-8">
              <TopChannelsTable />
            </div>
          )}
          {activeTab === 'products' && <ProductsTable />}
          {activeTab === 'orders' && <OrdersTable />}
          {activeTab === 'users' && <UsersTable />}
        </div>
      </div>
    </div>
  );
} 