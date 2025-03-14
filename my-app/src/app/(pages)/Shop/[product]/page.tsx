"use client";

import Link from 'next/link';
import Image from 'next/image';
import { RiArrowRightSLine } from 'react-icons/ri';
import { PiLineVertical } from 'react-icons/pi';
import { FaStar, FaStarHalf, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { AiFillTwitterCircle } from 'react-icons/ai';
import { GetProductsData, TopPicksData } from '@/sanity/lib/queries';
import { useState, useEffect } from 'react';
import { IProduct , Products} from '@/data';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import TopPicks from '@/components/TopPicks';
import CartSidebar from '@/components/CartSidebar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // for toast mesage
import OutOfStockModal from "@/components/OutOfStockModal"


export default function Product({ params }: { params: { product: string } }) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [TopPicksProduct, setTopPicksProduct] = useState<Products[] | null>(null);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [cartSidebar, setCartSidebar] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch()

  const handleAddToCart = async () => {
    // Check if the requested quantity exceeds the available stock
    if (product && product.stockLevel < count) {
      setIsModalOpen(true); // Show modal if out of stock
      return;
    }
  
    // Check if a size is required but not selected
    if (product && product.size?.length && !selectedSize) {
      setError("Please select a size.");
      return;
    }
  
    // Check if a color is required but not selected
    if (product && product.color?.length && !selectedColor) {
      setError("Please select a color.");
      return;
    }
  
    if (!product) {
      console.error("Product is null. Cannot add to cart.");
      return;
    }
    
    // Create a detailed cart item for Redux (for UI purposes)
    const cartItem = {
      id: product._id,
      name: product.name,
      imagePath: product.imagePath,
      description: product.description,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: count,
      discountPercentage: product.discountPercentage,
    };
  
    // Step 1: Update Redux cart state
    dispatch(addToCart(cartItem));
    setError(""); // Clear any existing errors
  
    // Step 2: Open the cart sidebar
    setCartSidebar(true);
  
    // Step 3: Send a POST request to your Sanity API route to update the cart
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Only send the minimal data needed for the Sanity schema:
        // product reference and quantity.
        body: JSON.stringify({
          productId: product._id,
          quantity: count,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        console.log("Cart saved in Sanity:", data);
      } else {
        console.error("Failed to save cart in Sanity");
      }
    } catch (error) {
      console.error("Error saving to Sanity:", error);
    }
  
    // Step 4: Display a toast notification for success
    toast.success(`Added ${count} ${product.name} to cart!`, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  
  
  

  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true); // Start loading
        const productData: IProduct[] = await GetProductsData();
        console.log(productData);

        const foundProduct = productData.find((item) => item._id === params.product);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false); // Stop loading
      }

    }

    async function picks_data() {
      try {
        setLoading(true);
        const picksData: IProduct[] = await TopPicksData();
        setTopPicksProduct(picksData || null);
      } catch {

        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }

    fetchProductData();
    picks_data()




  }, [params.product]);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => setCount((prev) => Math.max(1, prev - 1));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  if (!product) {
    return <div><h1 className="mt-32">Product not found</h1></div>;
  }



  return (
    <div className="max-w-[1440px] font-poppins w-full md:mt-[90px] mt-[60px] md:py-10 py-5">
      {/* 1st Section: Breadcrumb Links */}
      <div className="flex text-center items-center md:gap-4 gap-1 text-[#9F9F9F] font-normal md:text-base text-sm md:px-20 px-5">
        <Link href="/">Home</Link>
        <RiArrowRightSLine size={20} color="black" />
        <Link href="/Shop">Shop</Link>
        <RiArrowRightSLine size={20} color="black" />
        <PiLineVertical color="#EEEEEE" size={30} />
        <p className="text-black">
          {product.name}
        </p>
      </div>

      {/* 2nd Section: Product Details */}
      <div className="flex md:flex-row flex-col mt-10 w-full md:px-20 px-5 gap-4">
        {/* Left: Thumbnail Images */}
        <div className='md:flex-row  flex-col-reverse flex gap-3'>
        <div className="flex md:flex-col flex-row md:gap-8 gap-3 md:mr-10 mr-3">
          {[product.imagePath, product.imagePath, product.imagePath, product.imagePath].map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Thumbnail ${index + 1}`}
              width={100}
              height={100}
              priority={false} // Default lazy loading
              className="bg-[#FFF9E5] w-[66px] md:h-[80px] h-[55px] md:rounded-lg rounded-sm border hover:border-black"
            />
          ))}
        </div>

        {/* Center: Main Product Image */}
        <div className="relative md:mr-20">
  {/* Discount Badge */}
  {product.discountPercentage > 0 &&
  <div className="absolute top-4 right-4 bg-red-600 text-white text-lg font-bold px-3 py-1 rounded-md shadow-lg">
    {product.discountPercentage}% OFF
  </div>
}

  {/* Product Image */}
  <Image
    src={product.imagePath}
    width={423}
    height={500}
    alt="Asgaard Sofa"
    priority
    className="bg-[#FFF9E5] w-[423px] md:h-[500px] h-[250px] rounded-lg"
  />
</div>
</div>

        {/* Right: Product Description */}
        <div className="flex flex-col md:w-[35%] w-full">
          <h1 className="font-normal md:text-[42px] leading-[60px] text-3xl">{product.name} </h1>
          <p className="text-[#9F9F9F] font-medium md:text-2xl"><span>Price : </span>${product.price} </p>

          {/* Ratings */}
          <div className="flex md:gap-2 gap-[0px] md:my-2 my-0 items-center">
            {[1, 2, 3, 4].map((star) => (
              <FaStar key={star} size={20} className="text-[#FFDA5B]" />
            ))}
            <FaStarHalf size={20} className="text-[#FFDA5B]" />
            <PiLineVertical color="#EEEEEE" size={40} />
            <p className="font-normal md:text-sm text-xs text-[#9F9F9F]">5 Customer Reviews</p>
          </div>

          {/* Description */}
          <p className="font-normal text-sm mb-4">
            {product.description}
          </p>

          {/* Size Options */}
          <p className="text-[#9F9F9F] font-normal text-sm mb-3">Size</p>
          <div className="flex gap-4">
            {product.size?.length ? (
              product.size.map((size) => (
                <p
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex p-1 rounded-md text-sm justify-center items-center cursor-pointer ${selectedSize === size ? 'bg-[#FBEBB5]' : 'bg-[#FAF4F4]'
                    }`}
                >
                  {size}
                </p>
              ))
            ) : (
              <p>Only this size available</p>
            )}
          </div>
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {/* Color Options */}
          <p className="text-[#9F9F9F] font-normal text-sm my-3">Color</p>
          <div className="flex gap-4">
            {product.color?.length ? (
              product.color.map((color, index) => (
                <button key={index} onClick={() => setSelectedColor(color)}>
                  <p
                    className={`w-[30px] h-[30px] rounded-full ${selectedColor === color ? 'border-4 border-lime-950' : 'border-2 border-transparent'
                      }`}
                    style={{ backgroundColor: color }}
                  ></p>
                </button>
              ))
            ) : (
              <p>Only this color available</p>
            )}

          </div>


          {/* Add to Cart Section */}
          <div className='flex flex-col pb-12 gap-5 border-b border-[#D9D9D9]'>
          <div className="flex md:gap-4 gap-2 my-5 ">
            <div className="flex px-2 md:gap-8 gap-4 items-center border border-[#9F9F9F] w-[123px] md:h-16 h-12 rounded-[10px] justify-center">
              <button onClick={handleDecrement} className="text-xl font-bold"> - </button>
              <p className="text-lg">{count}</p>
              <button onClick={handleIncrement} className="text-xl"> + </button>
            </div>
            <div className="flex items-center border border-black w-[215px] md:h-16 h-12 rounded-[10px] md:rounded-[15px] justify-center">

              <button
                onClick={handleAddToCart}
                className=" md:font-normal font-bold md:text-xl text-xs"

              >
                Add To Cart
              </button>

              {/* Show Modal if Out of Stock */}
              <OutOfStockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

              <CartSidebar CartmenuOpen={cartSidebar} CartsetMenuOpen={setCartSidebar} />

              <ToastContainer />
              
            </div>

          </div>

          {product.stockLevel > 0 ? (
  <div className="inline-block bg-[#FBEBB5] text-black font-bold px-4 py-2  w-fit rounded-md shadow-md">
    In Stock , Grab Yours Now!
  </div>
) : (
  <div className="inline-block bg-red-100 text-red-800 font-bold px-4 py-2 rounded-md shadow-md">
    Out of Stock
  </div>
)}

          </div>


          {/* SKU, Category, Tags, Share */}
          <div className="flex justify-between md:my-16 my-5 md:gap-5 gap-2 items-start md:w-[25%] text-[#9F9F9F] font-normal text-base">
            <div className="flex flex-col gap-5">
              <p>SKU</p>
              <p>Category</p>
              <p>Tags</p>
              <p>Share</p>
            </div>
            <div className="flex flex-col gap-5">
              {[':', ':', ':', ':'].map((colon, index) => (
                <p key={index}>{colon}</p>
              ))}
            </div>
            <div className="flex flex-col gap-5">
              <p>SS001</p>
              <p>Sofas</p>
              <p className="md:w-[190px]">Sofa, Chair, Home, Shop</p>
              <div className="flex gap-4">
                <FaFacebook size={20} color="black" />
                <FaLinkedin size={20} color="black" />
                <AiFillTwitterCircle size={24} color="black" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3rd Section: Product Description */}
      <div className="w-full md:pt-16 pt-5 border-t border-[#D9D9D9]">
        <div className="md:w-[70%] w-[90%] mx-auto flex flex-col text-[#9F9F9F]">
          <div className="flex justify-center md:gap-14 gap-4 md:mb-10 mb-5">
            {['Description', 'Additional Information', 'Reviews [5]'].map((tab, index) => (
              <h2 key={index} className="font-normal md:text-2xl text-xl hover:text-black cursor-pointer">
                {tab}
              </h2>
            ))}
          </div>
          <div>
            <p className='text-sm md:text-base'>
              Embodying the raw, wayward spirit of rock &lsquo;n&rsquo; roll, the Kilburn portable active stereo speaker takes the unmistakable look and sound of Marshall, unplugs the chords, and takes the show on the road.
            </p>
            <p className="md:my-8 my-3 text-sm md:text-base">
              Weighing in under 7 pounds, the Kilburn is a lightweight piece of vintage styled engineering. Setting the bar as one of the loudest speakers in its class, the Kilburn is a compact, stout-hearted hero with a well-balanced audio which boasts a clear midrange and extended highs for a sound that is both articulate and pronounced. The analogue knobs allow you to fine tune the controls to your personal preferences while the guitar-influenced leather strap enables easy and stylish travel.
            </p>
          </div>
        </div>
      </div>

      {/* two pics ..Sofaa */}

      <div className='flex flex-col md:flex-row gap-4 justify-between md:px-12 px-5 md:pb-10 pb-5 border-b border-[#D9D9D9]'>

        <div className='bg-[#FFF9E5] md:w-[605px] md:h-[348px] rounded-xl'>
          <Image src={"/CloudSofa1.svg"} width={600} height={300} alt='Cloud Sofa'></Image>
        </div>

        <div className='bg-[#FFF9E5] md:w-[605px] md:h-[348px] rounded-xl'>
          <Image src={"/CloudSofa2.svg"} width={600} height={300} alt='Cloud Sofa'></Image>
        </div>

      </div>

      {/* Picks Products */}
      <TopPicks products={TopPicksProduct || []} />



    </div>
  );
}
