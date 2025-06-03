"use client";

import Image from "next/image";
import PagesHeader from "@/components/PagesHeader";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeFromCart, setCartItems, updateQuantity } from "@/redux/cartSlice";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/cart");
      dispatch(setCartItems(response.data.cart.items));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [dispatch]);

  const calculateDiscountedPrice = (item: any) => {
    const price = item.product.variants.variantactualSellPrice;
    const discount = item.product.variants.discountPercentage || 0;
    return price * (1 - discount / 100);
  };

  const cartTotal = cartItems.reduce((acc, item) => {
    const discountedPrice = calculateDiscountedPrice(item);
    return acc + (item.quantity * discountedPrice);
  }, 0);

  const handleRemove = async (id: string) => {
    try {
      dispatch(removeFromCart(id));
      await axios.delete(`/api/cart`, { params: { productId: id } });
      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleQuantity = async (id: string, newQuantity: number) => {
    try {
      if(newQuantity < 1) return;
      setUpdatingItems(prev => [...prev, id]);
      
      // Optimistic update
      dispatch(updateQuantity({
        id,
        quantity: newQuantity,
        discountedPrice: calculateDiscountedPrice(
          cartItems.find(item => item.product._id === id)
        )
      }));

      await axios.patch("/api/cart", { 
        productId: id, 
        quantity: newQuantity 
      });
      
    } catch (error) {
      await fetchCartItems();
      console.error("Quantity update error:", error);
    } finally {
      setUpdatingItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  return (
    <div className="w-full mt-16 md:mt-24 font-poppins max-w-[1440px] mx-auto">
      <PagesHeader name="Cart" title="Your Cart" />

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-950 border-t-transparent"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-2xl font-bold">
          Your cart is empty.
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Products Section */}
            <div className="flex-1">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-semibold">Products</h2>
              </div>
              
              {cartItems.map((item) => {
                const discountedPrice = calculateDiscountedPrice(item);
                const originalPrice = item.product.variants.variantactualSellPrice;
                const discount = item.product.variants.discountPercentage || 0;

                return (
                  <div key={item._key} className="border-b py-6">
                    <div className="flex gap-6">
                      <div className="relative md:w-32 md:h-32 w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.product.imageSet[0]}
                          alt={item.product.productNameEn}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-sm"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium mb-2">
                              {item.product.productNameEn}
                            </h3>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold">
                                ${discountedPrice.toFixed(2)}
                              </p>
                              {discount > 0 && (
                                <div className="text-sm text-gray-500 line-through">
                                  ${originalPrice.toFixed(2)}
                                </div>
                              )}
                            </div>
                            {discount > 0 && (
                              <span className="text-green-600 text-sm">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => handleRemove(item.product._id)}
                            className="text-gray-500 hover:text-red-600"
                            disabled={updatingItems.includes(item.product._id)}
                          >
                            <MdDelete size={24} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleQuantity(item.product._id, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                              disabled={updatingItems.includes(item.product._id)}
                            >
                              <AiOutlineMinus />
                            </button>
                            <span className="px-4 py-2 border-x">
                              {updatingItems.includes(item.product._id) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                              ) : item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantity(item.product._id, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                              disabled={updatingItems.includes(item.product._id)}
                            >
                              <AiOutlinePlus />
                            </button>
                          </div>
                          
                          <p className="text-lg font-semibold">
                            Subtotal: ${(item.quantity * discountedPrice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:w-96 w-full">
              <div className="bg-[#f5f5f5] p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-gray-600">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between text-xl font-semibold mb-4">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6">
                    Taxes and discounts calculated at checkout
                  </p>

                  <Link href="/checkout">
                    <button className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors">
                      Proceed to Checkout
                    </button>
                  </Link>

                  <div className="mt-4 text-center">
                    <Link href="/Shop" className="text-gray-600 hover:text-black">
                      ← Continue shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;