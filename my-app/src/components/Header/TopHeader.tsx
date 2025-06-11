// components/TopHeader.js
import React, { useState, useEffect } from 'react';
import { Truck, Tag, CheckCircle } from 'react-feather';

export default function TopHeader() {
  const [isVisible, setIsVisible] = useState(true);
  
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

  if (!isVisible) return null;

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
        
        {/* Right side - Close button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close announcement"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </header>
  );
}