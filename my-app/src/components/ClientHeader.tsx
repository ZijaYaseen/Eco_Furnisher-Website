// components/ClientHeader.tsx
"use client";

import { useEffect, useState } from "react";
import TopHeader from "./TopHeader";
import Header from "./Header";

export default function ClientHeader() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.pageYOffset === 0);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {atTop && <TopHeader />}
      {/* Pass atTop to Header */}
      <Header atTop={atTop} shadow="md" />
    </>
  );
}
