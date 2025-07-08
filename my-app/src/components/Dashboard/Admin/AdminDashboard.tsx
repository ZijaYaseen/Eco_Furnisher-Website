import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import StatsCards from './StatsCards';
import TopChannelsTable from './TopChannelsTable';
import SalesChart from './SalesChart';
import { FiMenu } from 'react-icons/fi';
import ProductsTable from './ProductsTable';
import OrdersTable from './OrdersTable';
import UsersTable from './UsersTable';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 text-black mt-[100px]">
      {/* Hamburger for mobile */}
      <div className="md:hidden fixed top-[100px] md:top-0 left-0 w-full z-50 bg-white border-b border-gray-200 flex items-center h-14 px-4 shadow-sm">
        <button
          className="text-2xl mr-4"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu />
        </button>
        <span className="font-bold text-lg">Admin Dashboard</span>
      </div>
      {/* Sidebar: responsive */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Main content: add top margin on mobile for fixed bar */}
      <div className="flex-1 flex flex-col md:ml-0 mt-14 md:mt-0 p-4 md:p-8">
        <Topbar />
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
        {/* Add more widgets/sections here as needed */}
      </div>
    </div>
  );
} 