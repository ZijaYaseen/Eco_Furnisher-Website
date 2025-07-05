"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  FiShoppingBag, 
  FiHeart, 
  FiSettings, 
  FiLogOut,
  FiAward,
  FiShoppingCart,
  FiDollarSign
} from 'react-icons/fi';
import Link from 'next/link';
import type { Product, CartItem, WishlistItem } from '@/data';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  avatar?: string;
}

interface Stats {
  totalOrders: number;
  totalSpent: string;
  wishlistItems: number;
  cartItems: number;
}

// Types based on Sanity schema
interface ShippingDetails {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
}

interface PaymentDetails {
  transactionId: string;
  paymentAmount: number;
  paymentMethod: string;
  paymentDate: string;
}

interface OrderProductVariant {
  vid: string;
  image: string;
  quantity: number;
  subtotal: number;
}

interface OrderItem {
  product: Product;
  variants: OrderProductVariant[];
  Total: number;
}

interface OrderDetails {
  _id: string;
  createdAt: string;
  orderStatus: 'pending' | 'paid';
  orderTotal: number;
  shippingCost: number;
  taxAmount: number;
  paymentMethod: 'stripe' | 'paypal' | 'cod';
  trackingNumber?: string;
  trackingStatus: 'pending' | 'shipped' | 'delivered';
  shippingDetails: ShippingDetails;
  paymentDetails: PaymentDetails;
  orderItems: OrderItem[];
}

const UserDashboard = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          setUserData({
            name: session.user.name,
            email: session.user.email,
            phone: '',
            address: '',
            joinDate: 'Recently',
            avatar: session.user.image,
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

  // Fetch cart from cart API (real data)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setCart(data.cart?.items || []);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCart([]);
      }
    };
    fetchCart();
  }, [session]);

  // Fetch wishlist from wishlist API (real data)
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist', { credentials: 'include' });
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
    };
    fetchWishlist();
  }, [session]);

  // Fetch orders from new /api/order endpoint
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/order', { credentials: 'include' });
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
    };
    fetchOrders();
  }, [session]);

  // Calculate stats
  useEffect(() => {
    if (orders.length >= 0) {
      // Only sum paid orders for totalSpent
      const totalSpent = orders
        .filter(order => order.orderStatus === 'paid')
        .reduce((sum, order) => sum + (parseFloat(order.orderTotal?.toFixed(2) || '0')), 0);
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

        <Link href="/Wishlist">
        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Wishlist Items</p>
              <a href="/Wishlist" className="text-xl lg:text-2xl font-bold text-black hover:text-blue-600 transition-colors">{stats?.wishlistItems || 0}</a>
            </div>
            <FiHeart className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
          </div>
        </div>
        </Link>

        <Link href={"/Cart"}>
        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Cart Items</p>
              <p className="text-xl lg:text-2xl font-bold text-black">{stats?.cartItems || 0}</p>
            </div>
            <FiShoppingCart className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
          </div>
        </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-base lg:text-lg font-semibold text-black">Recent Orders</h3>
        </div>
        <div className="p-4 lg:p-6">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order: OrderDetails) => (
                <div key={order._id} className="border border-gray-100 rounded-lg p-4 flex flex-col gap-2 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Order Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className={`text-xs font-semibold ${order.orderStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-black text-sm">Total: ${order.orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    {order.orderItems.map((item: OrderItem, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 border border-gray-100 rounded-lg p-2 bg-white">
                        <img
                          src={item.variants[0]?.image || item.product?.imageSet?.[0] || '/placeholder.png'}
                          alt={item.product?.productNameEn}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-black text-xs lg:text-sm">{item.product?.productNameEn}</p>
                          <p className="text-xs text-gray-500">Category: {item.product?.CategoryName}</p>
                          {item.variants.map((variant: OrderProductVariant, vIdx: number) => (
                            <span key={vIdx} className="block text-xs text-gray-600">Qty: {variant.quantity} | Subtotal: ${variant.subtotal.toFixed(2)}</span>
                          ))}
                        </div>
                      </div>
                    ))}
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
            <button
              className="w-full py-2 px-4 border border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-colors text-sm lg:text-base"
              onClick={() => setActiveTab('orders')}
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4 lg:space-y-6" id='orders'>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-base lg:text-lg font-semibold text-black">My Orders</h3>
        </div>
        <div className="p-4 lg:p-6">
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order: OrderDetails) => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-black text-sm lg:text-base">Order Date: {new Date(order.createdAt).toLocaleDateString()}</h4>
                      <p className="text-xs lg:text-sm text-gray-600">Status: <span className={`font-semibold ${
                        order.orderStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</span></p>
                      
                    </div>
                    <div className="text-left md:text-right mt-2 md:mt-0">
                      <p className="font-semibold text-black text-sm lg:text-base">Total: ${order.orderTotal.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h5 className="font-medium text-gray-700 mb-2 text-xs lg:text-sm">Products:</h5>
                    <div className="space-y-2">
                      {order.orderItems.map((item: OrderItem, idx: number) => (
                        <div key={idx} className="flex items-center space-x-3 border border-gray-100 rounded-lg p-2 bg-white">
                          <Image
                          width={200}
                          height={200}
                            src={item.variants[0]?.image || item.product?.imageSet?.[0] || '/placeholder.png'}
                            alt={item.product?.productNameEn}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-black text-xs lg:text-sm">{item.product?.productNameEn}</p>
                            <p className="text-xs text-gray-500">Category: {item.product?.CategoryName}</p>
                            {item.variants.map((variant: OrderProductVariant, vIdx: number) => (
                              <span key={vIdx} className="block text-xs text-gray-600">Qty: {variant.quantity} | Subtotal: ${variant.subtotal.toFixed(2)}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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
                <input type="checkbox" className="rounded border-gray-300"/>
                <span className="text-gray-700 text-sm lg:text-base">Order updates and tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" />
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
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
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
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default UserDashboard;