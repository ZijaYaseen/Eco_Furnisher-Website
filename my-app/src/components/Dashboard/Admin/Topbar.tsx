import { FiBell, FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const user = session?.user;

  return (
    <header className="w-full flex items-center justify-between md:px-10 px-4 py-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-2 w-full max-w-md">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden text-2xl mr-1"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <FiMenu />
        </button>
        <FiSearch className="text-gray-400 text-4xl" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <div className="flex items-center md:gap-4 gap-1">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <FiBell className="text-2xl text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {user?.image ? (
              <Image
                src={user.image}
                width={300}
                height={300}
                alt={user.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <FiUser className="text-lg" />
              </span>
            )}
            <span className="font-medium text-sm text-gray-700">{user?.name || 'Admin'}</span>
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[200px]">
              <div className="flex items-center gap-3 mb-3">
                {user?.image ? (
                  <Image
                  width={300}
                  height={300}
                    src={user.image}
                    alt={user.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <span className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl">
                    <FiUser />
                  </span>
                )}
                <div>
                  <div className="font-semibold text-gray-900 text-base">{user?.name || '-'}</div>
                  <div className="text-xs text-gray-500">{user?.email || '-'}</div>
                </div>
              </div>
              <div className="mb-2">
                <span className="block text-xs text-gray-400">Role</span>
                <span className="block text-sm font-medium text-gray-700 capitalize">{user?.role || 'user'}</span>
              </div>
              <button
                className="mt-3 w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-700 transition"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 