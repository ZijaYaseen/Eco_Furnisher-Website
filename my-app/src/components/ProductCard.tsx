"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { Product } from "@/data";

// Helper to truncate text
const truncateText = (text: string, wordLimit: number = 25): string => {
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

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const variants  = product.variants;
  const primary = variants[0];
  const originalPrice = primary.variantActualSellPrice || 0;
  const discountPercent = primary.discountPercentage || 0;
  const discountedPrice = originalPrice - (originalPrice * discountPercent) / 100;
  const allColors = variants.flatMap(v => v.colors ?? []);

  // Check wishlist status on mount
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist");
        const data = await res.json();
        const inWishlist = data.items?.some(
          (item: any) => item.product?._id === product._id
        );
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error("Wishlist check error:", error);
      }
    };
    
    checkWishlist();
  }, [product._id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id })
      });
      
      if (res.ok) {
        setIsInWishlist(!isInWishlist);
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  return (
    <Link
      href={`/Shop/${product.slug.current}`}
      className="group block relative"
    >
      {/* Wishlist Heart Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? (
          <FaHeart className="text-gray-700" />
        ) : (
          <FaRegHeart className="text-gray-700" />
        )}
      </button>

      {/* Image */}
      <div className="relative md:h-60 h-40">
        <Image
          src={primary.variantImage}
          alt={product.productNameEn}
          fill
          className="object-cover bg-gray-100 object-center transition-transform duration-300 group-hover:scale-105"
        />
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-4 py-2 text-xs font-bold">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Details */}
      <div className="pt-3">
        <div className="mt-1 flex items-center gap-4">
          <span className="md:text-2xl text-xl text-gray-700 font-bold">
            ${discountedPrice.toFixed(2)}
          </span>
          {discountPercent > 0 && (
            <span className="md:text-lg text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <h3 className="md:text-lg text-sm font-medium text-gray-900">
          {truncateText(product.productNameEn, 10)}
        </h3>

        <div className="mt-1 flex items-center gap-4">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-600">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Color swatches for all variant colors */}
        <div className="my-3 flex gap-2">
          {allColors.map((color, idx) => (
            <div
              key={idx}
              title={color.colorName}
              className="w-6 h-6 border-2"
              style={{ backgroundColor: color.colorCode }}
            />
          ))}
        </div>

        {/* Choose Option Button */}
        <div className="md:py-4 py-2">
          <Link
          href={`/Shop/${product.slug.current}`}
          className="md:py-4 py-2 bg-white text-black text-center border border-gray-950 md:rounded-full rounded-3xl font-semibold block hover:bg-gray-800 hover:text-white ease-in-out transition-colors"
        >
          CHOOSE OPTIONS
        </Link>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;