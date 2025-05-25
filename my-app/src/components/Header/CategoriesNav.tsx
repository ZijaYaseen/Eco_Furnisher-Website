"use client";
import React, { useState } from "react";
import Link from "next/link";
import { megaMenuData } from "@/data";
import { IoChevronDown } from "react-icons/io5";

export default function MegaMenu() {
  // Track which category is hovered/active
  const [activeCat, setActiveCat] = useState<string | null>(null);

  // Find the active category object (if any)
  const activeCategory = megaMenuData.find((cat) => cat.name === activeCat);

  // Hide second row if user leaves
  const handleMouseLeave = () => {
    setActiveCat(null);
  };

  return (
    <div className="w-full mt-[56px] font-poppins hidden md:block">
      {/* TOP ROW: main categories */}
      <div
        className="flex justify-center space-x-8 bg-white border-b border-gray-300 py-3"
        onMouseLeave={handleMouseLeave}
      >
        {megaMenuData.map((cat) => {
          return (
            <div
              key={cat.name}
              className="cursor-pointer hover:text-blue-600 font-medium text-base flex items-center space-x-1"
              onMouseEnter={() => setActiveCat(cat.name)}
            >
              <span>{cat.name}</span>
           
                <IoChevronDown size={14} />
              
            
            </div>
          );
        })}
      </div>

      {/* SECOND ROW: columns for the active category */}
      {activeCategory && (
        <div
          className="w-full bg-white border-b border-gray-300 py-5"
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-4 gap-8">
            {activeCategory.columns.map((column) => (
              <div key={column.heading}>
                <h3 className="font-semibold mb-2">{column.heading}</h3>
                <ul className="space-y-1">
                  {column.items.map((item) => (
                    <li key={item.name}>
                      <Link href={item.link}>
                        <span className="text-gray-700 hover:underline">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
