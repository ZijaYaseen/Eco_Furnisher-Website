import { FiBell, FiSearch, FiUser } from 'react-icons/fi';

export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-2 w-full max-w-md">
        <FiSearch className="text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <FiBell className="text-xl text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <FiUser className="text-xl" />
          </span>
          <span className="font-medium text-sm text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
} 