import { FiHome, FiBox, FiShoppingCart, FiUsers } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', value: 'dashboard', icon: <FiHome /> },
  { label: 'Products', value: 'products', icon: <FiBox /> },
  { label: 'Orders', value: 'orders', icon: <FiShoppingCart /> },
  { label: 'Users', value: 'users', icon: <FiUsers /> },
];

export default function Sidebar({ activeTab, setActiveTab, open, onClose }: any) {
  return (
    <aside className={`fixed md:static z-40 left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-md transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="font-bold text-xl text-black">Admin Dashboard</span>
        {onClose && (
          <button className="md:hidden text-2xl" onClick={onClose}>&times;</button>
        )}
      </div>
      <nav className="flex flex-col gap-2 mt-6 px-2">
        {navItems.map((item) => (
          <button
            key={item.value}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-base transition-colors w-full text-left ${activeTab === item.value ? 'bg-gray-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
            onClick={() => { setActiveTab(item.value); if (onClose) onClose(); }}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
