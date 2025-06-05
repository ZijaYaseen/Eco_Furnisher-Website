"use client";

import "swiper/css";
import ProductCard from "../components/ProductCard"; 
import { Product } from "@/data";

interface BestSellerSectionProps {
  products: Product[];
}

const TopPicks = ({ products }: BestSellerSectionProps) => {

  return (
    <section className="mx-auto max-w-screen-xl py-12 px-6 lg:px-8 relative bg-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
          Top Picks For You
        </h2>
        <p className="mt-2 text-lg text-gray-600">
        Discover our curated selection of quality products just for you.
        </p>
      </div>

  
       
       <div className="grid grid-cols-1 md:grid-cols-4 md:gap-10">
       {products.map((product) => (
       
       <ProductCard product={product} key={product._id}/>

   ))}
       </div>
    </section>
  );
};

export default TopPicks;
