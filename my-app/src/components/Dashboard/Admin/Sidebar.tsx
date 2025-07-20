import { FiHome, FiBox, FiShoppingCart, FiUsers, FiLogOut } from 'react-icons/fi';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import  { IoCloseOutline } from 'react-icons/io5';

const navItems = [
  { label: 'Dashboard', value: 'dashboard', icon: <FiHome /> },
  { label: 'Products', value: 'products', icon: <FiBox /> },
  { label: 'Orders', value: 'orders', icon: <FiShoppingCart /> },
  { label: 'Users', value: 'users', icon: <FiUsers /> },
];

export default function Sidebar({ activeTab, setActiveTab, open, onClose }: any) {
  return (
    <aside className={`fixed top-0 left-0 z-[80] h-screen w-64 bg-white border-r border-gray-200 shadow-lg transition-transform duration-200 flex flex-col overflow-y-auto ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} style={{ minHeight: '100vh' }}>
      {/* Mobile close button */}
      <div className="md:hidden flex justify-end items-center px-4 pt-4">
        <button onClick={onClose} aria-label="Close sidebar" className="text-2xl text-gray-500 hover:text-black">
          <IoCloseOutline />
        </button>
      </div>
      {/* Profile Section */}
      <div className="flex flex-col items-center md:py-6 py-2 border-b border-gray-100 bg-white">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 mb-2">
          <Image src="/Logo.svg" alt="Admin" width={64} height={64} />
        </div>
        <div className="text-lg font-semibold text-gray-800">EcoFurnisher</div>
        <div className="text-xs text-gray-500">zija@ecofurnisher.com</div>
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-1 mt-6 px-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.value}
            className={`flex items-center gap-3 px-5 py-3 rounded-lg font-medium text-base transition-all w-full text-left mb-1
              ${activeTab === item.value
                ? 'bg-gray-100 text-black shadow border-l-4 border-gray-800'
                : 'text-gray-700 hover:bg-gray-50 hover:text-black'}
            `}
            onClick={() => { setActiveTab(item.value); if (onClose) onClose(); }}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
        {/* Logout button */}
        <button
          className="flex items-center gap-3 px-5 py-3 rounded-lg font-medium text-base transition-all w-full text-left text-red-600 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <span className="text-xl"><FiLogOut /></span>
          Logout
        </button>
      </nav>
    </aside>
  );
}