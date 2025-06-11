"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { PiLineVertical } from "react-icons/pi";
import { FaStar, FaStarHalf, FaPlus, FaMinus, FaFacebook, FaLinkedin } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import CartSidebar from "./CartSidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OutOfStockModal from "./OutOfStockModal";
import { PortableText } from '@portabletext/react';
import { Product, CartItem } from "@/data";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [cartSidebar, setCartSidebar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  // initial main image from productImageSet
  const [mainImage, setMainImage] = useState<string>(product.imageSet[0]);

  // Track selected variant by vid
  const [selectedVariantId, setSelectedVariantId] = useState<string>(product.variants[0].vid);
  
  // Find the selected variant object
  const selectedVariant = product.variants.find(v => v.vid === selectedVariantId) || product.variants[0];

  // Mobile carousel state and ref
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.clientWidth;
      setCurrentMobileIndex(Math.round(scrollLeft / width));
    }
  };

  // Price calculation using selected variant
  const originalPrice = selectedVariant.variantActualSellPrice;
  const discountPercent = selectedVariant.discountPercentage;
  const discountedPrice = originalPrice - originalPrice * (discountPercent / 100);

  const handleAddToCart = async () => {

    if (product.inventory < count) {
      setIsModalOpen(true);
      return;
    }
    
    const cartItem: CartItem = {
      // Use vid for unique key
      _key: `${product._id}-${selectedVariantId}`,
      product: {
        ...product,
        // Only include selected variant
        variants: [selectedVariant]
      },
      quantity: count,
      subtotal: discountedPrice * count,
      discountedPrice,
      variantId: selectedVariantId
    };
    
    dispatch(addToCart(cartItem));
    setCartSidebar(true);
    
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: product._id, 
          variantId: selectedVariantId, // send vid
          quantity: count 
        }),
      });
      const data = await response.json();
      if (!data.success) console.error("Failed to save cart in Sanity");
    } catch (err) {
      console.error("Error saving to Sanity:", err);
    }
    
    toast.success(`Added ${count} ${product.productNameEn} to cart!`, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleIncrement = () => setCount(prev => prev + 1);
  const handleDecrement = () => setCount(prev => Math.max(1, prev - 1));

  const onColorClick = (vid: string) => {
    setSelectedVariantId(vid);
    // Find and set variant image
    const variant = product.variants.find(v => v.vid === vid);
    if (variant) {
      setMainImage(variant.variantImage);
    }
  };

  return (
    <div className="max-w-[1440px] font-poppins w-full md:mt-[90px] mt-[60px] md:py-10 py-5">
      {/* Breadcrumb */}
      <div className="flex text-center items-center md:gap-4 gap-1 text-[#9F9F9F] font-normal md:text-base text-sm md:px-20 px-5">
        <Link href="/">Home</Link>
        <RiArrowRightSLine size={20} color="black" />
        <Link href="/Shop">Shop</Link>
        <RiArrowRightSLine size={20} color="black" />
        <PiLineVertical color="#EEEEEE" size={30} />
        <p className="text-black">{product.productNameEn}</p>
      </div>

      {/* Product Details */}
      <div className="flex md:flex-row flex-col mt-10 w-full md:px-20 px-5 gap-4">
        {/* Desktop View */}
        <div className="hidden md:flex">
          <div className="flex flex-col gap-3 md:mr-10 overflow-x-hidden">
            {product.imageSet.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                width={100}
                height={100}
                className={`bg-gray-50 w-[80px] md:h-[80px] h-[55px] border rounded-md cursor-pointer ${mainImage === src ? "border-gray-500" : "border-gray-100"}`}
                onClick={() => setMainImage(src)}
              />
            ))}
          </div>
          <div className="relative md:mr-10">
            {discountPercent > 0 && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-lg font-bold px-3 py-1 shadow-lg">
                {discountPercent}% OFF
              </div>
            )}
            <Image
              src={mainImage}
              width={423}
              height={500}
              alt={product.productNameEn}
              priority
              className="bg-gray-50 w-[423px] md:h-[423px] h-[250px] border border-gray-100 rounded-md"
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden relative">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="overflow-x-scroll snap-x snap-mandatory flex scroll-smooth"
          >
            {product.imageSet.map((src, idx) => (
              <div key={idx} className="snap-center w-full flex-shrink-0">
                <div className="relative">
                  {discountPercent > 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-lg font-bold px-3 py-1 rounded-md shadow-lg">
                      {discountPercent}% OFF
                    </div>
                  )}
                  <Image
                    src={src}
                    width={423}
                    height={500}
                    alt={`Image ${idx + 1}`}
                    className="w-full object-cover bg-gray-50"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-2">
            {product.imageSet.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${idx === currentMobileIndex ? "bg-black" : "bg-gray-300"}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Right: Description & Options */}
        <div className="flex flex-col md:w-[50%] w-full">
          <h1 className="font-semibold md:text-[28px] md:leading-[38px] text-2xl">{product.productNameEn}</h1>

          {/* Price */}
          <div className="my-3">
            {discountPercent > 0 ? (
              <div className="flex items-center space-x-5 mt-2">
                <span className="text-black font-medium text-4xl">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-gray-400 font-medium text-2xl line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-black font-medium md:text-2xl text-xl">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Ratings */}
          <div className="flex md:gap-2 gap-[0px] md:mb-2 my-0 items-center">
            {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
              <FaStar key={i} size={18} className="text-[#FFDA5B]" />
            ))}
            {product.rating - Math.floor(product.rating) >= 0.5 && (
              <FaStarHalf size={18} className="text-[#FFDA5B]" />
            )}
            <PiLineVertical color="#EEEEEE" size={28} />
            <p className="font-normal md:text-sm text-xs text-[#9F9F9F]">{product.rating.toFixed(1)}</p>
            <PiLineVertical color="#EEEEEE" size={28} />
            <p className="font-normal text-sm text-[#9F9F9F]">5 Customer Reviews</p>
          </div>

          {/* Color Options */}
          <div className="flex items-center space-x-4 my-4">
            {product.variants.map((v) => {
              const color = v.colors;
              return (
                <button 
                  key={v.vid}
                  onClick={() => onColorClick(v.vid)}
                  className="flex flex-col items-center focus:outline-none"
                >
                  <div
                    style={{ backgroundColor: color.colorCode }}
                    className={`w-8 h-8 rounded-full border ${
                      selectedVariantId === v.vid 
                        ? 'ring-2 ring-offset-2 ring-black' 
                        : 'border-gray-300'
                    }`}
                  />
                  <span className="mt-1 text-xs text-gray-700">
                    {color.colorName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Short Description */}
          <div className="my-3 text-gray-800">
            {product.shortDescription}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col pb-10 gap-5">
            <div className="flex md:gap-4 gap-2 my-5">
              <div className="flex px-2 gap-8 items-center border border-[#9F9F9F] w-[123px] h-16 rounded-md justify-center">
                <button onClick={handleDecrement} className="text-xl font-bold"> - </button>
                <p className="text-lg">{count}</p>
                <button onClick={handleIncrement} className="text-xl"> + </button>
              </div>
              <div className="flex items-center border border-[#9F9F9F] w-[315px] md:w-[400px] h-16 rounded-md justify-center">
                <button onClick={handleAddToCart} className="text-xl">
                  Add To Cart
                </button>
                <OutOfStockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <CartSidebar CartmenuOpen={cartSidebar} CartsetMenuOpen={setCartSidebar} />
                <ToastContainer />
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="prose max-w-none mb-4 space-y-4">
            <div className="border-b pb-2 flex justify-between items-center cursor-pointer" onClick={() => setShowOverview(!showOverview)}>
              <h4 className="font-bold text-xl">Description</h4>
              {showOverview ? <FaMinus /> : <FaPlus />}
            </div>
            {showOverview && (
              <div className="prose max-w-none mb-4 space-y-4">
                <PortableText value={product.description} />
              </div>
            )}
          </div>

          {/* SKU, Category, Tags, Share */}
          <div className="grid grid-cols-[auto,1fr] gap-y-2 gap-x-4 my-9 text-[#9F9F9F] font-normal text-base">
            <p className="font-bold">SKU :</p>
            <p>{product.productSku}</p>
            <p className="font-bold">Category :</p>
            <p>{product.CategoryName ? product.CategoryName.join(", ") : product.categoryId}</p>
            <p className="font-bold">Tags :</p>
            <p>{product.tags && product.tags.length > 0 ? product.tags.join(", ") : ""}</p>
            <p className="font-bold">Share :</p>
            <div className="flex gap-4">
              <FaFacebook size={20} color="black" />
              <FaLinkedin size={20} color="black" />
              <AiFillTwitterCircle size={24} color="black" />
            </div>
          </div>

          {product.inventory > 0 ? (
            <div className="inline-block bg-gray-200 text-black font-bold px-4 py-2 w-fit rounded-md shadow-md">
              In Stock, Grab Yours Now!
            </div>
          ) : (
            <div className="inline-block bg-red-100 text-red-800 font-bold px-4 py-2 rounded-md shadow-md">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}