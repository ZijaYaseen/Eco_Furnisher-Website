"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PagesHeader from "@/components/PagesHeader";
import { UseAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { setCartItems } from "@/redux/cartSlice";
import axios from "axios";

// Define the interface for billing form fields.
interface FormData {
  firstName: string;
  lastName: string;
  companyName?: string;
  country: string;
  streetAddress: string;
  town: string;
  province: string;
  zip: string;
  phone: string;
  email: string;
  additionalInfo?: string;
}

const Checkout = () => {
  // Get cart items from Redux.
  const cartItems = UseAppSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  // Payment method state (bank transfer or cash on delivery).
  const [paymentMethod, setPaymentMethod] = useState("bank");

  // Billing details state and error state.
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    streetAddress: "",
    town: "",
    province: "",
    zip: "",
    phone: "",
    email: "",
    additionalInfo: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Fetch cart items from the backend API (/api/cart).
  // The endpoint returns data for both guest and logged‑in users.
  const fetchCartItems = async () => {
    try {
      const response = await axios.get("/api/cart");
      console.log("API Response:", response.data);
      if (response.data.success && response.data.cart) {
        dispatch(setCartItems(response.data.cart.items));
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [dispatch]);

  // Calculate the cart total using the subtotals provided by the backend.
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + (item.subtotal || 0),
    0
  );

  // Handle changes in billing form fields.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Basic validation for required billing fields.
  const validate = (): Partial<FormData> => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last Name is required.";
    if (!formData.country.trim())
      newErrors.country = "Country is required.";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street Address is required.";
    if (!formData.town.trim())
      newErrors.town = "Town / City is required.";
    if (!formData.province.trim())
      newErrors.province = "Province is required.";
    if (!formData.zip.trim()) newErrors.zip = "ZIP code is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    return newErrors;
  };

  // Handle form submission.
  // On submit, this function sends the checkout data to your API endpoint.
  // The API will first check if the user is logged in.
  //  If not logged in (or token missing), a 401 response will be returned and the client will redirect to /login.
  //  If logged in and paymentMethod === "bank" but payment details are not present,
  //   the API instructs the client to redirect to the Payment page.
  //  If paymentMethod === "cod", the API creates the order immediately and returns success.
  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare the checkout payload.
    const checkoutData = {
      billingDetails: formData,
      paymentMethod,
      orderItems: cartItems, // You can include full product details (selected color, size, quantity, etc.)
      orderTotal: cartTotal,
      // Note: For bank transfer payment, you might send paymentDetails later after successful payment.
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });
      const data = await response.json();

      if (response.status === 401) {
        // User is not logged in, redirect to the login page.
        router.push("/Account/Login");
      } else if (data.redirectTo) {
        // If the API instructs a redirect (for example, for bank transfer payment),
        // redirect the user to the specified payment page.
        router.push(data.redirectTo);
      } else if (data.success) {
        // For COD (or after a successful bank payment), order is created.
        // Redirect to order confirmation page.
        router.push("/Order-place-success");
      } else {
        console.error("Checkout error:", data.error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // If the cart is empty, show a message instead of the form.
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="w-full mt-16 md:mt-24 font-poppins">
        <PagesHeader name="Checkout" title="Checkout" />
        <div className="flex items-center justify-center h-96 text-xl font-semibold">
          Your cart is empty! Please add items before proceeding to checkout.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-16 md:mt-24 font-poppins">
      <PagesHeader name="Checkout" title="Checkout" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form
          onSubmit={handlePlaceOrder}
          className="flex flex-col md:flex-row gap-10"
        >
          {/* Billing Details Section */}
          <div className="flex-1">
            <h2 className="text-4xl font-semibold mb-6">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="flex flex-col">
                <label htmlFor="firstName" className="text-base font-medium">
                  First Name
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
                  Last Name
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
              {/* Company Name (Optional) */}
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="companyName" className="text-base font-medium">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-1 p-3 border rounded-md focus:outline-none border-gray-300"
                />
              </div>
              {/* Country / Region */}
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="country" className="text-base font-medium">
                  Country / Region
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`mt-1 p-3 border rounded-md focus:outline-none ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Sri Lanka"
                />
                {errors.country && (
                  <p className="text-red-500 text-sm">{errors.country}</p>
                )}
              </div>
              {/* Street Address */}
              <div className="flex flex-col md:col-span-2">
                <label
                  htmlFor="streetAddress"
                  className="text-base font-medium"
                >
                  Street Address
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
                />
                {errors.streetAddress && (
                  <p className="text-red-500 text-sm">
                    {errors.streetAddress}
                  </p>
                )}
              </div>
              {/* Town / City */}
              <div className="flex flex-col">
                <label htmlFor="town" className="text-base font-medium">
                  Town / City
                </label>
                <input
                  type="text"
                  id="town"
                  name="town"
                  value={formData.town}
                  onChange={handleChange}
                  className={`mt-1 p-3 border rounded-md focus:outline-none ${
                    errors.town ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.town && (
                  <p className="text-red-500 text-sm">{errors.town}</p>
                )}
              </div>
              {/* Province */}
              <div className="flex flex-col">
                <label htmlFor="province" className="text-base font-medium">
                  Province
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={`mt-1 p-3 border rounded-md focus:outline-none ${
                    errors.province ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Western Province"
                />
                {errors.province && (
                  <p className="text-red-500 text-sm">{errors.province}</p>
                )}
              </div>
              {/* ZIP Code */}
              <div className="flex flex-col">
                <label htmlFor="zip" className="text-base font-medium">
                  ZIP code
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className={`mt-1 p-3 border rounded-md focus:outline-none ${
                    errors.zip ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm">{errors.zip}</p>
                )}
              </div>
              {/* Phone */}
              <div className="flex flex-col">
                <label htmlFor="phone" className="text-base font-medium">
                  Phone
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
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-base font-medium">
                  Email Address
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
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              {/* Additional Information (Optional) */}
              <div className="flex flex-col md:col-span-2">
                <label
                  htmlFor="additionalInfo"
                  className="text-base font-medium"
                >
                  Additional Information (Optional)
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 p-3 border rounded-md focus:outline-none border-gray-300"
                  placeholder="Additional information"
                />
              </div>
            </div>
          </div>

          {/* Order Summary & Payment Method Section */}
          <div className="flex flex-col gap-6 md:w-[40%]">
            <h2 className="text-4xl font-semibold mb-6">Order Summary</h2>
            {cartItems.map((item) => (
              <div
                key={item._key}
                className="flex justify-between items-center border-b border-[#D9D9D9] pb-4"
              >
                <div className="flex flex-col">
                  <p className="text-lg font-medium">{item.product.name}</p>
                  <p className="text-sm text-[#9F9F9F]">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between text-xl font-bold">
              <p>Total</p>
              <p className="text-[#B88E2F]">${cartTotal.toFixed(2)}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4">Payment Method</h3>
              <div className="flex flex-col gap-4">
                <div
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex items-center gap-3 cursor-pointer ${
                    paymentMethod === "bank" ? "text-black" : "text-[#9F9F9F]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      paymentMethod === "bank"
                        ? "border-black bg-black"
                        : "border-[#9F9F9F]"
                    }`}
                  ></div>
                  <p>Direct Bank Transfer</p>
                </div>
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-3 cursor-pointer ${
                    paymentMethod === "cod" ? "text-black" : "text-[#9F9F9F]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      paymentMethod === "cod"
                        ? "border-black bg-black"
                        : "border-[#9F9F9F]"
                    }`}
                  ></div>
                  <p>Cash On Delivery</p>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-600">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our{" "}
                <span className="font-semibold">privacy policy</span>.
              </p>
            </div>
            <button
              type="submit"
              className="mt-6 flex justify-center mx-auto rounded-[15px] font-normal text-xl w-[318px] lg:py-5 py-3 border border-black"
            >
              Place order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
