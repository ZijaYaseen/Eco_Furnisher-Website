// /components/ProductCard.tsx
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
  // Use the first variant for pricing
  const firstVariant = product.variants;
  const originalPrice = firstVariant?.variantactualSellPrice ;
  const discountPercent = firstVariant?.discountPercentage;
  const discountedPrice =
    originalPrice - originalPrice * (discountPercent / 100);

  return (
    <Link
      href={`/Shop/${product.slug.current}`}
      className="group block border border-gray-100 shadow hover:shadow-lg p-2 relative"
    >
      {/* Image Container */}
      <div className="relative md:h-40 h-36">
        <Image
          src={product.imageSet[0]|| "/placeholder.png"}
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
      <div className="mt-2">
        <h3 className="text-sm md:text-base font-semibold text-gray-900">
          {product.productNameEn}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm md:text-base text-gray-700 font-bold">
            ${discountedPrice.toFixed(2)}
          </span>
          {discountPercent > 0 && (
            <span className="text-xs md:text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-4">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
        </div>
        {product.shortDescription && (
          <p className="mt-1 md:text-xs text-[10px] text-gray-600">
            {truncateText(product.shortDescription, 10)}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
