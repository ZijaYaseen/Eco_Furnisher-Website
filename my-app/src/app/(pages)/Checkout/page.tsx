"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PagesHeader from "@/components/PagesHeader";
import { useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { setCartItems } from "@/redux/cartSlice";
import axios from "axios";
import { FaSpinner, FaLock, FaShieldAlt } from "react-icons/fa";
import Image from "next/image";

interface FormData {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

const Checkout = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    country: "USA",
    state: "",
    zip: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/cart");
      if (response.data.success && response.data.cart) {
        dispatch(setCartItems(response.data.cart.items));
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [dispatch]);

  // Calculate cart total (sum of all subtotals)
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + (item.subtotal || 0),
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "zip") {
      if (value === "" || /^\d{0,5}$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }
    
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 3) {
        formatted = `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}`;
        if (cleaned.length > 6) {
          formatted += `-${cleaned.substring(6, 10)}`;
        }
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): Partial<FormData> => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zip.trim()) newErrors.zip = "ZIP code is required";
    else if (!/^\d{5}$/.test(formData.zip)) newErrors.zip = "Enter a valid 5-digit ZIP";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (formData.phone.replace(/\D/g, '').length !== 10) newErrors.phone = "Enter a valid 10-digit phone";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";
    return newErrors;
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Group cart items by product (since one product can have multiple variants)
    const groupedItems = cartItems.reduce((acc, item) => {
      const productId = item.product._id;
      if (!acc[productId]) {
        acc[productId] = {
          product: {
            _ref: productId,
            name: item.product.productNameEn,
            imageSet: item.product.imageSet
          },
          variants: [],
          Total: 0
        };
      }
      
      // Add variant to the product
      acc[productId].variants.push({
        vid: item.variantId,
        quantity: item.quantity,
        subtotal: item.subtotal
      });
      
      // Add to product total
      acc[productId].Total += item.subtotal;
      
      return acc;
    }, {} as Record<string, any>);
    
    // Convert grouped items to array
    const orderItems = Object.values(groupedItems);
    
    // Prepare checkout data
    const checkoutData = {
      billingDetails: formData,
      shippingDetails: formData, // Using same as billing for simplicity
      paymentMethod,
      orderItems,
      orderTotal: cartTotal,
      shippingCost: 0, // Free shipping for now
      taxAmount: 0 // No tax for now
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });
      
      const data = await response.json();

      if (response.status === 401) {
        router.push("/Account/Login");
      } 
      else if (data.redirectTo) {
        // For PayPal redirect
        router.push(data.redirectTo);
      } 
      else if (data.url) {
        // For Stripe redirect
        window.location.href = data.url;
      }
      else if (data.orderId) {
        // For COD or direct success
        router.push(`/checkout/order-success?orderId=${data.orderId}`);
      }
      else {
        console.error("Checkout error:", data.error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-12 md:mt-24 font-poppins bg-white text-black">
      <PagesHeader name="Checkout" title="Checkout" />

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-950 border-t-transparent"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-2xl font-bold">
          Your cart is empty! Please add items before proceeding.
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <form
            onSubmit={handlePlaceOrder}
            className="flex flex-col md:flex-row gap-10"
          >
            {/* Billing Details Section */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6">Billing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col">
                  <label htmlFor="firstName" className="text-base font-medium">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`mt-1 p-3 border rounded-md focus:outline-none ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                
                {/* Last Name */}
                <div className="flex flex-col">
                  <label htmlFor="lastName" className="text-base font-medium">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`mt-1 p-3 border rounded-md focus:outline-none ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
                
                {/* Street Address */}
                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="streetAddress"
                    className="text-base font-medium"
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className={`mt-1 p-3 border rounded-md focus:outline-none ${
                      errors.streetAddress ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="123 Main St"
                  />
                  {errors.streetAddress && (
                    <p className="text-red-500 text-sm">
                      {errors.streetAddress}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="flex flex-col">
                  <label htmlFor="country" className="text-base font-medium">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`mt-1 p-3 border rounded-md focus:outline-none ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Country</option>
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                    {/* Add other countries */}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm">{errors.country}</p>
                  )}
                </div>
                
                {/* City */}
                <div className="flex flex-col">
                  <label htmlFor="city" className="text-base font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`mt-1 p-3 border rounded-md focus:outline-none ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">{errors.city}</p>
                  )}
                </div>
                
                {/* State */}
                <div className="flex flex-col">
                  <label htmlFor="state" className="text-base font-medium">
                    State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`mt-1 p-3 border rounded-md focus:outline-none ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select State</option>
                    <option value="NY">New York</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    {/* Add other states as needed */}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm">{errors.state}</p>
                  )}
                </div>
                
                {/* ZIP Code */}
                <div className="flex flex-col">
                  <label htmlFor="zip" className="text-base font-medium">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    maxLength={5}
                    className={`mt-1 p-3 border rounded-md focus:outline-none ${
                      errors.zip ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="10001"
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-sm">{errors.zip}</p>
                  )}
                </div>
                
                {/* Phone */}
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-base font-medium">
                    Phone *
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`mt-1 p-3 border rounded-md focus:outline-none ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
                
                {/* Email */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="email" className="text-base font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 p-3 border rounded-md focus:outline-none ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary & Payment Section */}
            <div className="flex flex-col gap-6 md:w-[40%]">
              <h2 className="text-3xl font-bold mb-6">Your Order</h2>
              
              <div className="max-h-[50vh] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div
                    key={item._key}
                    className="flex justify-between items-start gap-4 py-3 border-b border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-1 flex-shrink-0">
                        <Image
                          src={item.product.variants[0]?.variantImage || item.product.imageSet[0]}
                          alt={item.product.productNameEn}
                          width={70}
                          height={70}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.product.productNameEn}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        {item.product.variants[0].discountPercentage > 0 && (
                          <span className="text-green-600 text-sm">
                            {item.product.variants[0].discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between text-lg font-medium">
                  <p>Subtotal</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-lg mt-2">
                  <p>Shipping</p>
                  <p>$0.00</p>
                </div>
                <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-gray-300">
                  <p>Total</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                <div className="flex flex-col gap-4">
                  <div
                    onClick={() => setPaymentMethod("stripe")}
                    className={`flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg ${
                      paymentMethod === "stripe" 
                        ? "border-black bg-gray-50" 
                        : "border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "stripe"
                          ? "border-black bg-black"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "stripe" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Credit Card</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay with Visa, Mastercard, American Express
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Image 
                        src="/visa.png" 
                        alt="Visa" 
                        width={40} 
                        height={25} 
                      />
                      <Image 
                        src="/mastercard.png" 
                        alt="Mastercard" 
                        width={40} 
                        height={25} 
                      />
                      <Image 
                        src="/amex.png" 
                        alt="American Express" 
                        width={40} 
                        height={25} 
                      />
                    </div>
                  </div>
                  
                  <div
                    onClick={() => setPaymentMethod("paypal")}
                    className={`flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg ${
                      paymentMethod === "paypal" 
                        ? "border-black bg-gray-50" 
                        : "border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "paypal"
                          ? "border-black bg-black"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "paypal" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay securely with your PayPal account
                      </p>
                    </div>
                    <Image 
                      src="/paypal.png" 
                      alt="PayPal" 
                      width={60} 
                      height={20} 
                    />
                  </div>
                    
                </div>
                
                {/* Security Badges */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaLock className="text-black" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaShieldAlt className="text-black" />
                    <span>SSL Encryption</span>
                  </div>
                </div>
                
                <p className="mt-6 text-sm text-gray-600 text-center">
                  Your payment information is encrypted and processed securely. 
                  We do not store your credit card details.
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex justify-center items-center mx-auto rounded-md font-semibold text-lg w-full py-4 bg-black text-white hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
              
              <p className="mt-4 text-sm text-gray-600 text-center">
                By placing your order, you agree to our{" "}
                <a href="#" className="font-semibold text-black underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-semibold text-black underline">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;