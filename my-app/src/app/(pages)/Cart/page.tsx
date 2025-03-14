"use client";

import Image from "next/image";
import PagesHeader from "@/components/PagesHeader";
import { UseAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeFromCart, setCartItems } from "@/redux/cartSlice";
import { MdDelete } from "react-icons/md";
import { useEffect } from "react";
import axios from "axios";

const Cart = () => {
  // Redux se cart items le rahe hain
  const cartItems = UseAppSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // API se cart items fetch karne ke liye function
  const fetchCartItems = async () => {
    try {
      const response = await axios.get("/api/cart");
      console.log("API Response:", response.data);
      // Response ke andar cart object ka items array update kar rahe hain
      dispatch(setCartItems(response.data.cart.items));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems(); // Page load par cart items fetch karo
  }, [dispatch]);

  // Cart total calculate karne ke liye
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + (item.subtotal || 0),
    0
  );

  // Item remove karne ka handler
  const handleRemove = async (id: string) => {
    try {
      // Redux store se update karo
      dispatch(removeFromCart(id));
      // DELETE request bhejo, yahan product id JSON body mein bheji ja rahi hai
      await axios.delete("/api/cart", { data: { productId: id } });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="w-full mt-16 md:mt-24 font-poppins">
      {/* Page Header */}
      <PagesHeader name="Cart" title="Cart" />

      {cartItems.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-2xl font-bold">
          Your cart is empty.
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cart Items Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#FFF9E5]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Subtotal
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <Link
                      key={item._key}
                      href={`/Shop/${item.product._id}`}
                      passHref
                      legacyBehavior
                    >
                      {/* <a> wrapper with display: contents ensures proper table semantics */}
                      <a style={{ display: "contents" }}>
                        <tr className="border-b border-gray-300">
                          <td className="px-6 py-4 whitespace-nowrap align-middle">
                            <div className="flex items-center space-x-4">
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={item.product.imagePath}
                                  alt={item.product.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {item.product.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-middle">
                            ${item.product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap align-middle">
                            <div className="w-12 h-8 border border-gray-300 rounded flex items-center justify-center text-sm">
                              {item.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-middle">
                            ${item.subtotal.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap align-middle">
                            {/* Delete button ke click se row Link trigger na ho */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemove(item.product._id);
                              }}
                              className="text-[#B88E2F]"
                            >
                              <MdDelete size={20} />
                            </button>
                          </td>
                        </tr>
                      </a>
                    </Link>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart Totals Section */}
            <div className="md:w-[343px] bg-[#FFF9E5] md:h-[390px] h-[320px] flex flex-col items-center w-[80%] mx-auto">
              <h1 className="mt-4 font-semibold text-[32px]">Cart Totals</h1>
              <div className="flex justify-between md:p-16 px-5 py-8 w-[90%]">
                <div className="flex flex-col gap-10 font-medium text-base">
                  <p>Subtotal</p>
                  <p>Total</p>
                </div>
                <div className="flex flex-col gap-10 font-medium text-base text-right">
                  <p className="text-base font-normal text-[#9F9F9F]">
                    ${cartTotal.toFixed(2)}
                  </p>
                  <p className="text-xl font-medium text-[#B88E2F]">
                    ${cartTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              <Link href="/Checkout">
                <button className="flex justify-center mx-auto rounded-[15px] font-normal text-xl w-[222px] lg:py-5 py-3 border border-black">
                  Check Out
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
