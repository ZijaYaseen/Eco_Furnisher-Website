"use client";

import Image from "next/image";
import PagesHeader from "@/components/PagesHeader";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeFromCart, setCartData, updateQuantity } from "@/redux/cartSlice";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const Cart = () => {
  const { items, grandTotal } = useAppSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/cart");
      dispatch(setCartData({
        items: response.data.cart.items || [],
        grandTotal: response.data.cart.grandTotal || 0
      }));
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [dispatch]);

  const handleRemove = async (itemKey: string) => {
    try {
      setUpdatingItems(prev => new Set(prev).add(itemKey));
      await axios.delete("/api/cart", { params: { itemKey } });
      
      // Optimistic update
      dispatch(removeFromCart(itemKey));
    } catch (error) {
      console.error("Error removing item:", error);
      await fetchCart(); // Revert on error
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const handleQuantity = async (itemKey: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingItems(prev => new Set(prev).add(itemKey));
      
      // Find the current item
      const currentItem = items.find(item => item._key === itemKey);
      if (!currentItem) return;
      
      // Calculate new subtotal based on existing discountedPrice
      const newSubtotal = newQuantity * (currentItem.discountedPrice || 0);
      
      // Optimistic update
      dispatch(updateQuantity({
        key: itemKey,
        quantity: newQuantity,
        subtotal: newSubtotal
      }));

      await axios.patch("/api/cart", { 
        itemKey, 
        quantity: newQuantity 
      });
      
    } catch (error) {
      console.error("Quantity update error:", error);
      await fetchCart(); // Revert on error
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  return (
    <div className="w-full mt-12 md:mt-24 font-poppins max-w-[1440px] mx-auto">
      <PagesHeader name="Cart" title="Your Cart" />

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-950 border-t-transparent"></div>
        </div>
      ) : items.length === 0 ? (
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
              
              {items.map((item) => {
                const variant = item.product.variants?.[0];
                const discountedPrice = item.discountedPrice || 0;
                const originalPrice = variant?.variantActualSellPrice || 0;
                const discount = variant?.discountPercentage || 0;
                const isUpdating = updatingItems.has(item._key);

                return (
                  <div key={item._key} className="border-b py-6">
                    <div className="flex gap-6">
                      <div className="relative md:w-32 md:h-32 w-20 h-20 flex-shrink-0">
                        <Image
                          src={variant?.variantImage || item.product.imageSet[0]}
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
                            {variant?.colors && (
                              <p className="text-sm mb-2">
                                Color: {variant.colors.colorName}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold">
                                ${discountedPrice.toFixed(2)}
                              </p>
                              {discount > 0 && (
                                <>
                                  <div className="text-sm text-gray-500 line-through">
                                    ${originalPrice.toFixed(2)}
                                  </div>
                                  <span className="text-green-600 text-sm">
                                    {discount}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemove(item._key)}
                            className="text-gray-500 hover:text-red-600"
                            disabled={isUpdating}
                          >
                            <MdDelete size={24} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleQuantity(item._key, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                              disabled={isUpdating}
                            >
                              <AiOutlineMinus />
                            </button>
                            <span className="px-4 py-2 border-x">
                              {isUpdating ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                              ) : item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantity(item._key, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                              disabled={isUpdating}
                            >
                              <AiOutlinePlus />
                            </button>
                          </div>
                          
                          <p className="text-lg font-semibold">
                            Subtotal: ${item.subtotal?.toFixed(2) || '0.00'}
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
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-gray-600">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between text-xl font-semibold mb-4">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6">
                    Taxes and discounts calculated at checkout
                  </p>

                  <Link href="/Checkout">
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