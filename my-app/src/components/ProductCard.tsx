"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
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
  const variants = product.variants ?? [];
  // Primary variant for image and price
  const primary = product.variants[0];
  const originalPrice = primary.variantActualSellPrice || 0;
  const discountPercent = primary.discountPercentage || 0;
  const discountedPrice = originalPrice - (originalPrice * discountPercent) / 100;

  // Collect all colors from all variants
  const allColors = variants.flatMap(v => v.colors ?? []);

  return (
    <Link
      href={`/Shop/${product.slug.current}`}
      className="group block relative"
    >
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
        <div className="mt-3 flex gap-2">
          {allColors.map((color, idx) => (
            <div
              key={idx}
              title={color.colorName}
              className="w-6 h-6 border-2"
              style={{ backgroundColor: color.colorCode }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
