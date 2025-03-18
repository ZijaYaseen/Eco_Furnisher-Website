"use client";

import { useEffect, useState } from "react";
import TopHeader from "./TopHeader";
import Header from "./Header";
import CategoriesNav from "./CategoriesNav";

export default function ClientHeader() {
  const [atTop, setAtTop] = useState(true);
  const [showBars, setShowBars] = useState(true);

  useEffect(() => {
    let prevScrollY = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      // Scroll up => show, scroll down => hide
      if (currentScrollY < prevScrollY) {
        setShowBars(true);
      } else if (currentScrollY > prevScrollY) {
        setShowBars(false);
      }
      setAtTop(currentScrollY === 0);
      prevScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* TopHeader only when at top */}
      {atTop && <TopHeader />}

      {/* Fixed container for Header + CategoriesNav */}
      <div
        className={`
          fixed w-full z-50 left-0 transition-transform duration-300
          ${showBars ? "translate-y-0" : "-translate-y-full"}
        `}
        // Set top property: if atTop then below TopHeader, else flush with top
        style={{ top: atTop ? "40px" : "0px" }}
      >
        <Header />
        <CategoriesNav />
      </div>
    </>
  );
}
