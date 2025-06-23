"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  FiShoppingBag, 
  FiHeart, 
  FiSettings, 
  FiLogOut,
  FiPackage,
  FiStar,
  FiTruck,
  FiGift,
  FiAward,
  FiShoppingCart,
  FiDollarSign
} from 'react-icons/fi';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  avatar?: string;
}

interface Order {
  id: string;
  total: string;
  date: string;
  status: string;
}

interface WishlistItem {
  id: string;
  name: string;
  category: string;
  price: string;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

interface Stats {
  totalOrders: number;
  totalSpent: string;
  wishlistItems: number;
  cartItems: number;
}

const UserDashboard = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          // TODO: Replace with actual API calls
          // const response = await fetch(`/api/user/${session.user.id}`);
          // const data = await response.json();
          // setUserData(data);
          
          // For now, use session data
          setUserData({
            name: session.user.name,
            email: session.user.email,
            phone: "",
            address: "",
            joinDate: "Recently",
            avatar: session.user.image
          });
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  // Fetch orders from checkout API
  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/checkout?userId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setOrders(data.orders || []);
          } else {
            setOrders([]);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
        }
      }
    };

    fetchOrders();
  }, [session]);

  // Fetch wishlist from wishlist API
  useEffect(() => {
    const fetchWishlist = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/wishlist?userId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setWishlist(data.items || []);
          } else {
            setWishlist([]);
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          setWishlist([]);
        }
      }
    };

    fetchWishlist();
  }, [session]);

  // Fetch cart from cart API
  useEffect(() => {
    const fetchCart = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/cart?userId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setCart(data.items || []);
          } else {
            setCart([]);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCart([]);
        }
      }
    };

    fetchCart();
  }, [session]);

  // Calculate stats
  useEffect(() => {
    if (orders.length >= 0) {
      const totalSpent = orders.reduce((sum, order) => sum + (parseFloat(order.total?.replace('$', '') || '0')), 0);
      setStats({
        totalOrders: orders.length,
        totalSpent: `$${totalSpent.toFixed(2)}`,
        wishlistItems: wishlist.length,
        cartItems: cart.length,
      });
    }
  }, [orders, wishlist, cart]);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-xl lg:text-2xl font-bold text-black">{stats?.totalOrders || 0}</p>
            </div>
            <FiShoppingBag className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-xl lg:text-2xl font-bold text-black">{stats?.totalSpent || "$0.00"}</p>
            </div>
            <FiDollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Wishlist Items</p>
              <p className="text-xl lg:text-2xl font-bold text-black">{stats?.wishlistItems || 0}</p>
            </div>
            <FiHeart className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Cart Items</p>
              <p className="text-xl lg:text-2xl font-bold text-black">{stats?.cartItems || 0}</p>
            </div>
            <FiShoppingCart className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-base lg:text-lg font-semibold text-black">Recent Orders</h3>
        </div>
        <div className="p-4 lg:p-6">
          {orders.length > 0 ? (
            <div className="space-y-3 lg:space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3 lg:space-x-4 mb-2 sm:mb-0">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FiPackage className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-black text-sm lg:text-base">{order.id}</p>
                      <p className="text-xs lg:text-sm text-gray-600">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-black text-sm lg:text-base">{order.total}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 lg:py-8">
              <FiShoppingBag className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3 lg:mb-4" />
              <p className="text-gray-600 text-sm lg:text-base">No orders yet</p>
              <p className="text-xs lg:text-sm text-gray-500">Start shopping to see your orders here</p>
            </div>
          )}
          <div className="mt-4 lg:mt-6">
            <button className="w-full py-2 px-4 border border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-colors text-sm lg:text-base">
              View All Orders
            </button>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-base lg:text-lg font-semibold text-black">Current Cart</h3>
          </div>
          <div className="p-4 lg:p-6">
            <div className="space-y-3">
              {cart.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <FiGift className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-black text-sm lg:text-base">{item.name}</p>
                      <p className="text-xs lg:text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-black text-sm lg:text-base">{item.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="w-full py-2 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm lg:text-base">
                View Cart ({cart.length} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-base lg:text-lg font-semibold text-black">My Orders</h3>
        </div>
        <div className="p-4 lg:p-6">
          {orders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-black text-sm lg:text-base">Order #{order.id}</h4>
                    <p className="text-xs lg:text-sm text-gray-600">Date: {order.date}</p>
                    <p className="font-semibold text-black text-sm lg:text-base">Total: {order.total}</p>
                    <p className="text-xs lg:text-sm text-gray-600">Status: {order.status}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-3">
                    <button className="flex items-center justify-center space-x-2 py-2 px-4 border border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-colors text-sm">
                      <FiTruck className="w-4 h-4" />
                      <span>Track Order</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 py-2 px-4 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <FiStar className="w-4 h-4" />
                      <span>Review</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 py-2 px-4 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <FiPackage className="w-4 h-4" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 lg:py-8">
              <FiShoppingBag className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3 lg:mb-4" />
              <p className="text-gray-600 text-sm lg:text-base">No orders yet</p>
              <p className="text-xs lg:text-sm text-gray-500">Start shopping to see your order history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-base lg:text-lg font-semibold text-black">My Wishlist</h3>
        </div>
        <div className="p-4 lg:p-6">
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow">
                  <div className="w-full h-32 lg:h-48 bg-gray-200 rounded-lg mb-3 lg:mb-4 flex items-center justify-center">
                    <FiGift className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-black text-sm lg:text-base">{item.name}</h4>
                    <p className="text-xs lg:text-sm text-gray-600">{item.category}</p>
                    <p className="font-semibold text-black text-sm lg:text-base">{item.price}</p>
                  </div>
                  <div className="mt-3 lg:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button className="flex-1 py-2 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm">
                      Add to Cart
                    </button>
                    <button className="py-2 px-4 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 lg:py-8">
              <FiHeart className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3 lg:mb-4" />
              <p className="text-gray-600 text-sm lg:text-base">Your wishlist is empty</p>
              <p className="text-xs lg:text-sm text-gray-500">Start adding items to your wishlist</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-base lg:text-lg font-semibold text-black">Account Settings</h3>
        </div>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Profile Info (read-only) */}
          <div>
            <h4 className="font-medium text-black mb-4 text-sm lg:text-base">Profile Information</h4>
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Name</label>
                  <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">{userData?.name || ''}</div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                  <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">{userData?.email || ''}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences (read-only) */}
          <div>
            <h4 className="font-medium text-black mb-4 text-sm lg:text-base">Notification Preferences</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" checked readOnly />
                <span className="text-gray-700 text-sm lg:text-base">Order updates and tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" checked readOnly />
                <span className="text-gray-700 text-sm lg:text-base">Promotional emails</span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="pt-6 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 py-2 px-4 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiAward },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-sm lg:text-base">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
      {/* Header */}
      <div className="mb-4 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-600 mt-2 text-sm lg:text-base">Welcome back, {userData?.name || "User"}!</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 lg:mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 lg:space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 lg:space-x-2 py-2 px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'wishlist' && renderWishlist()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default UserDashboard;