"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Swiper as SwiperCore } from "swiper";
import ProductCard from "../components/ProductCard"; 
import { Product } from "@/data";

interface BestSellerSectionProps {
  products: Product[];
}

const TopPicks = ({ products }: BestSellerSectionProps) => {

  return (
    <section className="mx-auto max-w-screen-xl md:py-12 py-5 px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 bg">
          Top Picks For You
        </h2>
        <p className="mt-2 text-lg text-gray-600">
        Discover our curated selection of quality products just for you.
        </p>
      </div>

  
       
       <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
       {products.map((product) => (
       
       <ProductCard product={product} />

   ))}
       </div>
    </section>
  );
};

export default TopPicks;
