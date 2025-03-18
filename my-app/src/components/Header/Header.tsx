"use client";

import React, { useState, useEffect } from "react";
import { NavMbl, Nav } from "@/data";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose, MdArrowBack, MdKeyboardArrowDown, MdSupervisorAccount } from "react-icons/md";
import Link from "next/link";
import SearchBar from "../SearchBar";
import { useRouter } from "next/navigation";
import { UseAppSelector } from "@/redux/hooks";

// NavItem interface for both desktop and mobile nav
interface NavItem {
  name: string;
  link?: string;
  subItems?: NavItem[];
}

export default function Header() {
  // State for mobile menu open/close and nested menu stack
  const [NavmenuOpen, NavsetMenuOpen] = useState(false);
  const [menuStack, setMenuStack] = useState<NavItem[][]>([NavMbl]);
  const router = useRouter();
  const cartItems = UseAppSelector((state) => state.cart.items);

  // Login token logic
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLoginClick = () => {
    // Close mobile menu (if open) and reset menu stack
    NavsetMenuOpen(false);
    setMenuStack([NavMbl]);
    if (token) {
      router.push("/Dashboard");
    } else {
      router.push("/Account/Login");
    }
  };

  // currentMenu is the last array in the menuStack; using non-null assertion
  const currentMenu = menuStack[menuStack.length - 1]!;

  return (
    <>
      <nav className="w-screen md:h-[60px] fixed bg-white border-b border-gray-300 flex items-center justify-between md:px-6">
        {/* MOBILE: Hamburger & Logo */}
        <div className="md:hidden flex items-center">
          <div
            className="text-2xl cursor-pointer mx-4"
            onClick={() => {
              if (!NavmenuOpen) {
                setMenuStack([NavMbl]);
              }
              NavsetMenuOpen(!NavmenuOpen);
            }}
          >
            <GiHamburgerMenu size={22} className="w-7 h-7 lg:w-8 lg:h-8" />
          </div>
          <div className="text-black font-serif">
            <h1 className="font-semibold text-2xl">EcoFurnish</h1>
          </div>
        </div>

        {/* DESKTOP: Logo */}
        <div className="hidden lg:block text-black font-serif">
          <h1 className="font-semibold lg:text-2xl text-xl px-5">EcoFurnish</h1>
        </div>

        {/* DESKTOP Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex space-x-6 uppercase tracking-wider text-sm font-medium">
            {Nav.map((item) => (
              <li key={item.name}>
                <Link href={item.Link || "#"}>
                  <span className="cursor-pointer px-3 flex items-center">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Unified Icons */}
        <div className="absolute right-5 md:static flex space-x-3 md:space-x-10 md:mr-10 z-50">
          <div onClick={handleLoginClick} className="cursor-pointer">
            <FaRegUser size={28} className="hidden md:block" />
          </div>
          <SearchBar />
          <Link href="/Wishlist">
            <FaRegHeart size={26} />
          </Link>
          <Link href="/Cart">
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
      {NavmenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-screen bg-white shadow-lg z-[100]">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300 text-black font-serif">
            {menuStack.length > 1 ? (
              <button
                onClick={() => setMenuStack(menuStack.slice(0, menuStack.length - 1))}
                className="flex items-center text-lg gap-1"
              >
                <MdArrowBack size={20} className="mr-2" />
                <span className="font-semibold text-xl">Back</span>
              </button>
            ) : (
              <span className="font-semibold text-xl">Menu</span>
            )}
            <div
              className="cursor-pointer"
              onClick={() => {
                NavsetMenuOpen(false);
                setMenuStack([NavMbl]);
              }}
            >
              <MdClose size={20} />
            </div>
          </div>
          {/* Mobile Menu Items */}
          <ul className="flex flex-col space-y-4 text-start p-8 max-h-[70vh] overflow-y-auto text-black">
            {currentMenu.map((item) => (
              <li
                key={item.name}
                className="border-b border-gray-300 flex items-center justify-between py-2"
              >
                {item.subItems && item.subItems.length > 0 ? (
                  <>
                    <span
                      onClick={() => setMenuStack([...menuStack, item.subItems!])}
                      className="cursor-pointer"
                    >
                      {item.name}
                    </span>
                    <MdKeyboardArrowDown
                      size={20}
                      className="cursor-pointer"
                      onClick={() => setMenuStack([...menuStack, item.subItems!])}
                    />
                  </>
                ) : (
                  <Link href={item.link || "#"} onClick={() => NavsetMenuOpen(false)}>
                    <span className="cursor-pointer block w-full">{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          {/* Mobile Account Section */}
          <div className="absolute bottom-0 w-full bg-black">
            <div
              onClick={handleLoginClick}
              className="cursor-pointer flex items-center p-6 gap-2 pb-14"
            >
              <MdSupervisorAccount size={30} className="text-white" />
              <span className="text-white">Account</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
