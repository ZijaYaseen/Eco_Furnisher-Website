// /app/best-seller/page.tsx

import Image from "next/image";
import Link from "next/link";
import { BestSellerSanity } from "@/sanity/lib/queries";
import ProductCard from "@/components/ProductCard";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Define your Product and Variant interfaces here (or import them from a shared types file)
interface Variant {
  vid: string;
  variantactualSellPrice: number;
  discountPercentage: number;
}

interface Product {
  _id: string;
  slug: { current: string };
  productNameEn: string;
  productSku: string;
  imagePath: string;
  rating: number;
  shortDescription: string;
  categoryId: string;
  CategoryName: string[];
  packingWeight: number;
  variants: Variant;
}

export default async function BestSellerPage() {
  const products: Product[] = await BestSellerSanity();

  return (
    <div>
      {/* Header */}
      <div className="relative h-64 w-full">
        <Image
          src="/path-to-your-background-image.jpg"
          alt="Best Sellers Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Best Sellers</h1>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-2 py-8">
        {products.length > 0 ? (
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No best seller products available
          </p>
        )}
      </div>
    </div>
  );
}
