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

// Define interfaces based on your schema
interface Variant {
    vid: string;
    variantSellPrice: number;
    variantSugSellPrice: number;
    variantactualSellPrice: number;
    discountPercentage: number;
}

export interface IProduct {
    _id: string;
    productNameEn: string;
    productSku: string;
    imageSet?: string[];
    imagePath: string;
    rating: number;
    shortDescription: string;
    // For this implementation, we assume description is a string containing HTML.
    description: string;
    inventory: number;
    tags: string[];
    seo: {
        metaTitle: string;
        metaDescription: string;
        metaKeywords: string[];
    };
    // In your query, variants are returned as an array.
    variants: Variant;
    size?: string[];
    color?: string[];
    // Optional category fields
    CategoryName?: string[];
    categoryId?: string;
}


interface ProductDetailClientProps {
    product: IProduct;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const dispatch = useDispatch();
    const [count, setCount] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [cartSidebar, setCartSidebar] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // For the collapsible description sections
    const [showOverview, setShowOverview] = useState(false);
    const [showSpec, setShowSpec] = useState(false);

    // Split the description string into Overview and Specification parts.
    // It assumes your description contains "Specification:" as a marker.
    const parts = product.description.split("Specification:");
    const overviewHTML = parts[0]; // Everything before "Specification:"
    const specHTML = parts[1] ? "Specification:" + parts[1] : "";

    // Determine images array from product.imageSet, fallback to imagePath if not provided
    const images = product.imageSet && product.imageSet.length > 0
        ? product.imageSet
        : [product.imagePath];

    // Desktop main image state
    const [mainImage, setMainImage] = useState(images[0]);

    // Mobile carousel state and ref
    const carouselRef = useRef<HTMLDivElement>(null);
    const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
    const handleScroll = () => {
        if (carouselRef.current) {
            const scrollLeft = carouselRef.current.scrollLeft;
            const width = carouselRef.current.clientWidth;
            const index = Math.round(scrollLeft / width);
            setCurrentMobileIndex(index);
        }
    };

    // Price calculation using first variant (with safe fallback)
    const firstVariant = product.variants;
    const originalPrice = firstVariant.variantactualSellPrice;
    const discountPercent = firstVariant.discountPercentage;
    const discountedPrice = originalPrice - originalPrice * (discountPercent / 100);

    const handleAddToCart = async () => {
        if (product.inventory < count) {
            setIsModalOpen(true);
            return;
        }
        if (product.size && product.size.length > 0 && !selectedSize) {
            setError("Please select a size.");
            return;
        }
        if (product.color && product.color.length > 0 && !selectedColor) {
            setError("Please select a color.");
            return;
        }
        const cartItem = {
            id: product._id,
            name: product.productNameEn,
            imagePath: mainImage,
            description: product.description,
            price: discountedPrice,
            size: selectedSize,
            color: selectedColor,
            quantity: count,
            discountPercentage: discountPercent,
        };
        dispatch(addToCart(cartItem));
        setError("");
        setCartSidebar(true);
        try {
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product._id, quantity: count }),
            });
            const data = await response.json();
            if (data.success) {
                console.log("Cart saved in Sanity:", data);
            } else {
                console.error("Failed to save cart in Sanity");
            }
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
                    {/* Thumbnails */}
                    <div className="flex flex-col gap-3 md:mr-10 overflow-x-hidden">
                        {images.map((src, index) => (
                            <Image
                                key={index}
                                src={src}
                                alt={`Thumbnail ${index + 1}`}
                                width={100}
                                height={100}
                                className={`bg-[#FFF9E5] w-[80px] md:h-[80px] h-[55px] md:rounded-md rounded-sm border cursor-pointer ${mainImage === src ? "border-gray-500" : "border-gray-100"}`}
                                onClick={() => setMainImage(src)}
                            />
                        ))}
                    </div>
                    {/* Main Image */}
                    <div className="relative md:mr-20">
                        {discountPercent > 0 && (
                            <div className="absolute top-4 right-4 bg-red-600 text-white text-lg font-bold px-3 py-1 rounded-md shadow-lg">
                                {discountPercent}% OFF
                            </div>
                        )}
                        <Image
                            src={mainImage}
                            width={423}
                            height={500}
                            alt={product.productNameEn}
                            priority
                            className="bg-[#FFF9E5] w-[423px] md:h-[500px] h-[250px] rounded-lg"
                        />
                    </div>
                </div>

                {/* Mobile View: Horizontal Swiper */}
                <div className="md:hidden relative">
                    <div
                        ref={carouselRef}
                        onScroll={handleScroll}
                        className="overflow-x-scroll snap-x snap-mandatory flex scroll-smooth"
                    >
                        {images.map((src, index) => (
                            <div key={index} className="snap-center w-full flex-shrink-0">
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
                                        alt={`Image ${index + 1}`}
                                        className="w-full object-cover bg-[#FFF9E5]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-2 space-x-2">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentMobileIndex ? "bg-black" : "bg-gray-300"}`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Right: Description & Options */}
                <div className="flex flex-col md:w-[35%] w-full">
                    <h1 className="font-semibold md:text-[42px] md:leading-[50px] text-3xl">{product.productNameEn}</h1>
                    <div className="my-1">
                        {discountPercent > 0 ? (
                            <div className="flex items-center space-x-5 mt-2">
                                <span className="text-black font-medium text-3xl">
                                    ${discountedPrice.toFixed(2)}
                                </span>
                                <span className="text-gray-400 font-medium text-xl line-through">
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

                    {/* Short Description */}
                    <div className="my-3">
                        {product.shortDescription}
                    </div>


                    {/* Size Options (only if available) */}
                    {product.size && product.size.length > 0 && (
                        <>
                            <p className="text-[#9F9F9F] font-normal text-sm mb-3">Size</p>
                            <div className="flex gap-4">
                                {product.size.map((size) => (
                                    <p
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`flex p-1 rounded-md text-sm justify-center items-center cursor-pointer ${selectedSize === size ? "bg-[#FBEBB5]" : "bg-[#FAF4F4]"
                                            }`}
                                    >
                                        {size}
                                    </p>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Color Options (only if available) */}
                    {product.color && product.color.length > 0 && (
                        <>
                            <p className="text-[#9F9F9F] font-normal text-sm my-3">Color</p>
                            <div className="flex gap-4">
                                {product.color.map((color, index) => (
                                    <button key={index} onClick={() => setSelectedColor(color)}>
                                        <p
                                            className={`w-[30px] h-[30px] rounded-full ${selectedColor === color ? "border-4 border-lime-950" : "border-2 border-transparent"
                                                }`}
                                            style={{ backgroundColor: color }}
                                        ></p>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    {/* Add to Cart Section */}
                    <div className="flex flex-col pb-10 gap-5">
                        <div className="flex md:gap-4 gap-2 my-5">
                            <div className="flex px-2 md:gap-8 gap-4 items-center border border-[#9F9F9F] w-[123px] md:h-16 h-12 rounded-[10px] justify-center">
                                <button onClick={handleDecrement} className="text-xl font-bold"> - </button>
                                <p className="text-lg">{count}</p>
                                <button onClick={handleIncrement} className="text-xl"> + </button>
                            </div>
                            <div className="flex items-center border border-black w-[215px] md:h-16 h-12 rounded-[10px] md:rounded-[15px] justify-center">
                                <button onClick={handleAddToCart} className="md:font-normal font-bold md:text-xl text-xs">
                                    Add To Cart
                                </button>
                                <OutOfStockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                                <CartSidebar CartmenuOpen={cartSidebar} CartsetMenuOpen={setCartSidebar} />
                                <ToastContainer />
                            </div>
                        </div>

                    </div>

                    {/* Collapsible Detailed Description Sections */}
                    <div className="prose max-w-none mb-4 space-y-4">
                        {/* Overview Section */}
                        <div className="border-b pb-2 flex justify-between items-center cursor-pointer" onClick={() => setShowOverview(!showOverview)}>
                            <h4 className="font-bold text-xl">Overview</h4>
                            {showOverview ? <FaMinus /> : <FaPlus />}
                        </div>
                        {showOverview && (
                            <div dangerouslySetInnerHTML={{ __html: overviewHTML }} />
                        )}

                        {/* Specification Section */}
                        {specHTML && (
                            <div className="border-b pb-2 flex justify-between items-center cursor-pointer" onClick={() => setShowSpec(!showSpec)}>
                                <h4 className="font-bold text-xl">Specification</h4>
                                {showSpec ? <FaMinus /> : <FaPlus />}
                            </div>
                        )}
                        {showSpec && specHTML && (
                            <div className="mt-2">
                                {specHTML.split("<br/>").map((line, index) => {
                                    const trimmed = line.trim();
                                    return trimmed ? <p key={index} className="mb-1">{trimmed}</p> : null;
                                })}
                            </div>
                        )}
                    </div>

                    {/* SKU, Category, Tags, Share Section */}
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
                        <div className="inline-block bg-[#FBEBB5] text-black font-bold px-4 py-2 w-fit rounded-md shadow-md">
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
