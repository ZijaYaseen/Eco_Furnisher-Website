"use client";

import React, { useState, useEffect } from "react";
import { megaMenuData } from "@/data";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose, MdArrowBack, MdKeyboardArrowDown } from "react-icons/md";
import Link from "next/link";
import SearchBar from "../SearchBar";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

// Enhanced NavItem interface for hierarchical structure
interface NavItem {
  name: string;
  link?: string;
  isHeading?: boolean;
  columns?: {
    heading: string;
    items: {
      name: string;
      link: string;
    }[];
  }[];
}

export default function Header() {
  // State for mobile menu
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [menuStack, setMenuStack] = useState<NavItem[][]>([megaMenuData]);
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);

  // Login token logic
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLoginClick = () => {
    setNavMenuOpen(false);
    setMenuStack([megaMenuData]);
    router.push(token ? "/Dashboard" : "/Account/Login");
  };

  const currentMenu = menuStack[menuStack.length - 1] || [];

  // Function to handle category clicks
  const handleCategoryClick = (category: NavItem) => {
    if (category.columns) {
      // Create a new level with headings
      const headingsLevel = category.columns.map(col => ({
        name: col.heading,
        isHeading: true,
        columns: category.columns
      }));
      setMenuStack([...menuStack, headingsLevel]);
    }
  };

  // Function to handle heading clicks
  const handleHeadingClick = (heading: NavItem) => {
    if (heading.columns) {
      // Find the items for this heading
      const column = heading.columns.find(col => col.heading === heading.name);
      if (column) {
        // Create a new level with items
        const itemsLevel = column.items.map(item => ({
          ...item,
          link: item.link || "/Shop"
        }));
        setMenuStack([...menuStack, itemsLevel]);
      }
    }
  };

  return (
    <>
      <nav className="w-full h-[60px] fixed bg-white border-b border-gray-300 flex items-center justify-between md:px-6 z-50">
        {/* MOBILE: Hamburger & Logo */}
        <div className="md:hidden flex items-center">
          <button
            className="text-2xl cursor-pointer mx-4"
            onClick={() => {
              if (!navMenuOpen) setMenuStack([megaMenuData]);
              setNavMenuOpen(!navMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            <GiHamburgerMenu size={22} className="w-7 h-7" />
          </button>
          <div className="text-black font-serif">
            <h1 className="font-semibold text-2xl">EcoFurnisher</h1>
          </div>
        </div>

        {/* DESKTOP: Logo */}
        <div className="hidden lg:block text-black font-serif">
          <h1 className="font-semibold md:text-3xl text-xl px-5">EcoFurnisher</h1>
        </div>

        {/* Unified Icons */}
        <div className="absolute right-5 md:static flex space-x-3 md:space-x-10 md:mr-10">
          <button onClick={handleLoginClick} className="cursor-pointer" aria-label="Account">
            <FaRegUser size={28} className="hidden md:block" />
          </button>
          <SearchBar />
          <Link href="/Wishlist" aria-label="Wishlist">
            <FaRegHeart size={26} />
          </Link>
          <Link href="/Cart" aria-label="Cart">
            <div className="relative">
              <HiOutlineShoppingCart size={28} />
              {cartItems.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </div>
              )}
            </div>
          </Link>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {navMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-screen bg-white shadow-lg z-[100]">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300 text-black font-serif">
            {menuStack.length > 1 ? (
              <button
                onClick={() => setMenuStack(menuStack.slice(0, menuStack.length - 1))}
                className="flex items-center text-lg gap-1"
                aria-label="Back"
              >
                <MdArrowBack size={20} className="mr-2" />
                <span className="font-semibold text-xl">Back</span>
              </button>
            ) : (
              <span className="font-semibold text-xl">EcoFurnisher</span>
            )}
            <button
              className="cursor-pointer"
              onClick={() => {
                setNavMenuOpen(false);
                setMenuStack([megaMenuData]);
              }}
              aria-label="Close menu"
            >
              <MdClose size={20} />
            </button>
          </div>
          
          {/* Mobile Menu Items */}
          <ul className="flex flex-col text-start p-4 max-h-[70vh] overflow-y-auto text-black">
            {currentMenu.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className="border-b border-gray-300 py-3"
              >
                {item.isHeading ? (
                  // Heading with arrow to show items
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{item.name}</span>
                    <button
                      onClick={() => handleHeadingClick(item)}
                      aria-label={`Show ${item.name} items`}
                    >
                      <MdKeyboardArrowDown size={24} />
                    </button>
                  </div>
                ) : item.columns ? (
                  // Category with arrow to show headings
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <button
                      onClick={() => handleCategoryClick(item)}
                      aria-label={`Show ${item.name} categories`}
                    >
                      <MdKeyboardArrowDown size={24} />
                    </button>
                  </div>
                ) : (
                  // Regular menu item
                  <Link 
                    href={item.link || "/Shop"} 
                    onClick={() => setNavMenuOpen(false)}
                    className="block w-full py-2"
                  >
                    <span className="cursor-pointer">{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          {/* Mobile Account Section */}
          <div className="absolute bottom-0 w-full bg-black p-4 text-white">
            <button
              onClick={handleLoginClick}
              className="flex items-center gap-2 w-full py-3"
            >
              <FaRegUser size={20} />
              <span className="font-medium">Account</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}