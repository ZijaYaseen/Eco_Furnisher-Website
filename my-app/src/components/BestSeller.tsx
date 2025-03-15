"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import type { Swiper as SwiperCore } from "swiper";

// Self-contained interfaces based on your Sanity query fields
interface Variant {
  vid: number;
  variantSellPrice: number;
  variantSugSellPrice: number;
  variantactualSellPrice: number;
  discountPercentage: number;
}

interface Product {
  _id: string;
  productNameEn: string;
  productSku: string;
  imagePath: string; // Single image fetched from Sanity
  rating: number;
  shortDescription: string;
  categoryId: string;
  CategoryName: string[];
  packingWeight: number;
  variants: Variant[];
}

interface BestSellerSectionProps {
  products: Product[];
}

// Helper to truncate text to a set number of words
const truncateText = (text: string, wordLimit: number = 25) => {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

// Helper function to render star ratings
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} size={14} className="text-yellow-500" />);
  }
  if (halfStar) {
    stars.push(<FaStarHalfAlt key="half" size={14} className="text-yellow-500" />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} size={14} className="text-yellow-500" />);
  }
  return <div className="flex gap-1">{stars}</div>;
};

const BestSellerSection = ({ products }: BestSellerSectionProps) => {
  const swiperRef = useRef<SwiperCore | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  return (
    <section className="mx-auto max-w-screen-xl py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
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
        slidesPerView={2}
        spaceBetween={10}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        className="relative"
      >
        {products.map((product, idx) => {
          // Using first variant for pricing & discount data
          const firstVariant = product.variants[0];
          const originalPrice = firstVariant?.variantactualSellPrice || 0;
          const discountPercent = firstVariant?.discountPercentage || 0;
          const discountedPrice =
            originalPrice - originalPrice * (discountPercent / 100);
          return (
            <SwiperSlide key={idx}>
              <Link
                href={`/product/${product.productSku}`}
                className="group block border border-gray-100 shadow hover:shadow-lg p-2 relative"
              >
                {/* Image Container with Discount Badge */}
                <div className="relative w-full h-40">
                  <Image
                    src={product.imagePath || "/placeholder.png"}
                    alt={product.productNameEn}
                    fill
                    className="object-cover bg-gray-100 object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  {discountPercent > 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                      {discountPercent}% OFF
                    </div>
                  )}
                </div>
                {/* Product Details */}
                <div className="md:mt-4 mt-2">
                  <h3 className="md:text-base text-sm font-semibold text-gray-900">
                    {product.productNameEn}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg text-gray-700 font-bold">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  {product.shortDescription && (
                    <p className="mt-1 text-xs text-gray-600">
                      {truncateText(product.shortDescription, 10)}
                    </p>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
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
          href="/best-sellers"
          className="inline-block rounded-md border border-black px-6 py-3 text-black font-semibold hover:bg-gray-800 hover:text-white"
        >
          View All Best Sellers
        </Link>
      </div>
    </section>
  );
};

export default BestSellerSection;
