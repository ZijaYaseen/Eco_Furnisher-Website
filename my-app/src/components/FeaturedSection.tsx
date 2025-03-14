import { Products } from "@/data"; 
import Image from "next/image";

interface FeaturedProps {
  products: Products[]; 
}

const FeaturedSection = ({ products = [] }: FeaturedProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 bg-[#FFF9E5] px-4 sm:px-8 lg:px-20 py-10 md:py-16 justify-center">
      {products.map((product) => (
        <div
          key={product._id}
          className="flex flex-col items-center border border-gray-400 p-2 md:p-4 shadow-md"
        >
          {/* Image wrapped in an anchor */}
          <a 
            href={product.amazonLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block w-full"
          >
            <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px]">
              <Image
                src={product.imagePath}
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </a>

          {/* Product Name */}
          <h2 className="font-semibold text-xl sm:text-2xl lg:text-3xl text-center mt-4">
            {product.name}
          </h2>

          {/* View More Button wrapped in an anchor */}
          <a 
            href={product.amazonLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <button className="md:mt-3 mt-2 font-medium text-base sm:text-lg lg:text-xl border-b-2 border-[#3f3b2d] leading-10 transition-all duration-300 hover:text-[#3f3b2d] hover:border-[#6c5c3f]">
              View More
            </button>
          </a>
        </div>
      ))}
    </div>
  );
};

export default FeaturedSection;
