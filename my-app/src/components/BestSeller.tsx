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

const BestSellerSection = ({ products }: BestSellerSectionProps) => {
  const swiperRef = useRef<SwiperCore | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  return (
    <section className="mx-auto max-w-screen-xl py-12 px-6 lg:px-8 relative">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
          Best Sellers
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Top-rated products loved by our customers
        </p>
      </div>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        slidesPerView={1}
        spaceBetween={24}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 4 },
        }}
        className="relative"
      >
        {products.map((product, idx) => (
          <SwiperSlide key={idx}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {!isBeginning && (
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white text-black rounded-full p-2 shadow"
        >
          <FaChevronLeft size={20} />
        </button>
      )}
      {!isEnd && (
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white text-black rounded-full p-2 shadow"
        >
          <FaChevronRight size={20} />
        </button>
      )}

      <div className="text-center mt-8">
        <Link
          href="/Best-Sellers"
          className="inline-block rounded-md border border-black px-6 py-3 text-black font-semibold hover:bg-gray-800 hover:text-white"
        >
          View All Best Sellers
        </Link>
      </div>
    </section>
  );
};

export default BestSellerSection;
