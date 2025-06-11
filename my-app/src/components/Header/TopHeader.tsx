// components/TopHeader.js
import React, { useState, useEffect } from 'react';
import { Truck, Tag, CheckCircle } from 'react-feather';

export default function TopHeader() {
  
  // Optional: Add announcement rotation
  const announcements = [
    "🚚 Free Shipping & Delivery Worldwide",
    "🌱 Sustainable Home Decor Solutions",
    "⭐ Premium Quality Guaranteed"
  ];
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-black text-white py-3 px-4 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - Brand promise */}
        <div className="hidden md:flex items-center space-x-2">
          <CheckCircle size={16} className="text-green-400" />
          <span className="text-xs">Premium Quality</span>
        </div>
        
        {/* Center - Main announcement */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center space-x-2 animate-fadeIn">
            <Truck size={16} className="text-gray-300" />
            <p className="text-xs md:text-sm font-medium tracking-wide">
              {announcements[currentAnnouncement]}
            </p>
            <Tag size={14} className="text-gray-300 hidden sm:inline" />
          </div>
        </div>
        
      </div>
    </header>
  );
}