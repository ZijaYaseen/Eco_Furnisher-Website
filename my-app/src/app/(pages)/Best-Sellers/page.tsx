// /app/best-seller/page.tsx

import Image from "next/image";
import { BestSellerSanity } from "@/sanity/lib/queries";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data";

export default async function BestSellerPage() {
  const products: Product[] = await BestSellerSanity();

  return (
    <div className="max-w-[1440px] font-poppins md:mt-[96px] mt-[60px]">
      {/* Header */}
      <div className="relative h-60 w-full">
        <Image
          src="/best-seller-home.jpg"
          alt="Best Sellers Background"
          fill
          className="object-cover bg-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center md:text-right md:justify-start md:px-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white">Best Sellers</h1>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-5 py-8">
        {products.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
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
