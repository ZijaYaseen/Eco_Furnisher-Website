// components/CartSidebar.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCartData } from "@/redux/cartSlice";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import Link from "next/link";
import { MdClose } from "react-icons/md";
import axios from "axios";

interface CartSidebarProps {
  CartmenuOpen: boolean;
  CartsetMenuOpen: (open: boolean) => void;
}

const CartSidebar = ({ CartmenuOpen, CartsetMenuOpen }: CartSidebarProps) => {
  const dispatch = useDispatch();
  const { items, grandTotal } = useAppSelector((state) => state.cart);

  const handleLinkClick = () => CartsetMenuOpen(false);

  const handleRemove = async (itemKey: string) => {
    try {
      await axios.delete("/api/cart", { params: { itemKey } });
      
      // REFRESH CART DATA AFTER REMOVAL
      const response = await fetch("/api/cart", { cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        dispatch(setCartData({
          items: data.cart.items || [],
          grandTotal: data.cart.grandTotal || 0
        }));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div>
      {CartmenuOpen && (
        <div className="fixed top-0 bottom-0 md:w-[30%] right-0 w-[75%] max-h-full bg-white shadow-lg z-[100] flex flex-col">
          <div className="flex flex-col space-y-5 text-start md:p-8 p-4">
            <div className="flex justify-between">
              <h1 className="p-1 border-b border-[#D9D9D9] font-semibold md:text-2xl text-lg">
                Shopping Cart
              </h1>
              <MdClose
                size={24}
                className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8"
                onClick={() => CartsetMenuOpen(false)}
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-240px)] px-2">
              {items.length === 0 ? (
                <div className="text-center flex items-center justify-center lg:text-2xl text-lg font-bold h-[400px]">
                  Your cart is empty.
                </div>
              ) : (
                items.map((item) => {
                  // ACCESS THE MATCHING VARIANT FROM THE PRODUCT
                  const variant = item.product.variants[0];
                  
                  // FALLBACK TO PRODUCT IMAGE IF VARIANT IMAGE NOT AVAILABLE
                  const imageUrl = variant?.variantImage
                  
                  return (
                    <div
                      key={item._key}
                      className="flex flex-col gap-4 border-b py-5"
                    >
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/Shop/${item.product?.slug?.current || ''}`}
                          onClick={handleLinkClick}
                          className="flex gap-4"
                        >
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={item.product?.productNameEn || "Product image"}
                              width={100}
                              height={100}
                              className="bg-gray-50 md:w-[76px] my-3 w-[70px] md:h-[80px] h-[70px]"
                            />
                          )}
                          <div className="flex flex-col text-left lg:gap-2 gap-1">
                            <p className="lg:text-lg text-xs font-semibold">
                              {item.product?.productNameEn || "Unknown Product"}
                            </p>
                            <div className="flex items-center lg:gap-4 gap-1 md:text-sm text-[9px]">
                              <p>Quantity : {item.quantity}</p>
                              <MdClose size={12} />
                              <span className="font-bold">
                                ${item.discountedPrice?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                            {variant?.colors && (
                              <p className="font-semibold text-sm">
                                Color : {variant.colors.colorName}
                              </p>
                            )}
                          </div>
                        </Link>
                        <MdClose
                          size={32}
                          color="white"
                          className="ml-auto bg-gray-400 w-[68px] h-6 border-4 border-gray-400 rounded-full cursor-pointer"
                          onClick={() => handleRemove(item._key)}
                        />
                      </div>
                      <div className="flex justify-between font-bold">
                        <p>Subtotal</p>
                        <p>${item.subtotal?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0">
              <div className="p-3 px-8 items-center flex justify-between">
                <h2 className="text-2xl font-semibold">Total</h2>
                <p className="font-bold text-xl">
                  ${grandTotal.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-white shadow-lg border-t border-[#D9D9D9] flex justify-between gap-2">
                <Link
                  href="/Cart"
                  className="w-36 h-10 flex justify-center items-center font-medium text-base border border-black rounded-[10px] hover:text-white hover:bg-black"
                  onClick={handleLinkClick}
                >
                  View Cart
                </Link>
                <Link
                  href="/Checkout"
                  className="w-36 h-10 flex justify-center items-center font-medium text-base border border-black rounded-[10px] hover:text-white hover:bg-black"
                  onClick={handleLinkClick}
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;