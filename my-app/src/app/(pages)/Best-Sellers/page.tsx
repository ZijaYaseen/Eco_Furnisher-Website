// /app/best-seller/page.tsx

import { BestSellerSanity } from "@/sanity/lib/queries";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data";
import PagesHeader from "@/components/PagesHeader";

export default async function BestSellerPage() {
  const products: Product[] = await BestSellerSanity();

  return (
    <div className="max-w-[1440px] font-poppins md:mt-[96px] mt-[60px]">
      <PagesHeader name="Best Seller" title="Best Seller" />

      {/* Products Grid */}
      <div className="container mx-auto px-5 py-8">
        {products.length > 0 ? (
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
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
