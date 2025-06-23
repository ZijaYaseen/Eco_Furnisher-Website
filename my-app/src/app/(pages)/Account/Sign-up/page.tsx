"use client";

import Link from "next/link";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const SignUp = () => {
  // State to manage visibility of both password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const router = useRouter();

  // Validation form:
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // First, create the user
      const response = await fetch("/api/account/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // User created successfully, now automatically login
        await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: true,
          callbackUrl: "/Dashboard"
        });
      } else {
        setError(data.error || "Failed to sign up!");
      }
    } catch (error) {
      setError("Error! Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: "google" | "facebook") => {
    setSocialLoading(provider);
    await signIn(provider, { 
      callbackUrl: "/Dashboard",
      redirect: true 
    });
  };

  return (
    <div className="max-w-[1440px] font-poppins w-full">
      <div className="w-[80%] mx-auto py-10">
        {/* Sign Up Section */}
        <div className="flex flex-col gap-8 md:w-[40%] w-full mx-auto">
          <h1 className="font-semibold text-4xl">Sign Up</h1>

          {error && <p className="text-red-500">{error}</p>}

          {/* Social Signup Buttons */}
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => handleSocialSignup("google")}
              disabled={isLoading || socialLoading !== null}
              className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {socialLoading === 'google' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              ) : (
                <FcGoogle size={24} />
              )}
              <span>{socialLoading === 'google' ? 'Signing up...' : 'Continue with Google'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignup("facebook")}
              disabled={isLoading || socialLoading !== null}
              className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {socialLoading === 'facebook' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <FaFacebook size={24} className="text-blue-600" />
              )}
              <span>{socialLoading === 'facebook' ? 'Signing up...' : 'Continue with Facebook'}</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-7" method="POST">
            {/* Full Name */}
            <div className="flex flex-col gap-4">
              <label htmlFor="fullName" className="text-base font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="mt-1 p-6 border border-[#9F9F9F] md:w-[453px] lg:h-[75px] h-12 rounded-[10px] focus:outline-none"
                placeholder="Enter your full Name"
                required
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-4">
              <label htmlFor="email" className="text-base font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 p-6 border border-[#9F9F9F] md:w-[453px] lg:h-[75px] h-12 rounded-[10px] focus:outline-none"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Password Field with Eye Icon */}
            <div className="flex flex-col gap-4">
              <label htmlFor="password" className="text-base font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="mt-1 p-6 border border-[#9F9F9F] md:w-[453px] w-full lg:h-[75px] h-12 rounded-[10px] focus:outline-none pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 md:right-6 right-4 flex items-center text-gray-500"
                >
                  {showPassword ? <PiEyeThin size={24} /> : <PiEyeSlashThin size={24} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field with Eye Icon */}
            <div className="flex flex-col gap-4">
              <label htmlFor="confirmPassword" className="text-base font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 p-6 border border-[#9F9F9F] md:w-[453px] w-full lg:h-[75px] h-12 rounded-[10px] focus:outline-none pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 md:right-6 right-4 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <PiEyeThin size={24} /> : <PiEyeSlashThin size={24} />}
                </button>
              </div>
            </div>

            <div className="flex gap-5 items-center">
              <button
                type="submit"
                disabled={isLoading || socialLoading !== null}
                className="font-normal text-xl w-[215px] md:h-16 h-14 rounded-[15px] border border-black disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="flex gap-2">
            <p className="font-light text-base">Already have an account?</p>
            <Link href={"/Account/Login"}>
              <p className="font-light text-base text-blue-600 underline">Log In</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;