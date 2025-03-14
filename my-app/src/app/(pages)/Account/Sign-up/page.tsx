"use client";

import Link from "next/link";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import { useState } from "react";

const SignUp = () => {
  // State to manage visibility of both password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation form:
  const [form, setForm] = useState({
    fullName:"",
    email:"",
    password:"",
    confirmPassword:"",
  });

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setForm({...form, [e.target.name] : e.target.value})
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    try {
      const response = await fetch("/api/account/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        }),
        credentials: "include", // Cookies store karne ke liye
      });
  
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token" , data.token)    // Token localStorage me save kia he
        window.location.href = "/Dashboard"  // Redirect user to Home page
      } else {
        alert(data.error || "Failed to sign up!");
      }
    } catch (error) {
      alert("Error! Try again." + error);
    }
  };
  

  return (
    <div className="max-w-[1440px] font-poppins w-full">
      <div className="w-[80%] mx-auto py-10">

        {/* Sign Up Section */}
        <div className="flex flex-col gap-8 md:w-[40%] w-full mx-auto">
          <h1 className="font-semibold text-4xl">Sign Up</h1>



          <form onSubmit={handleSubmit}
          className="flex flex-col gap-7" method="POST">
            {/* Full Name */}
            <div className="flex flex-col gap-4">
              <label htmlFor="fullName" className="text-base font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value= {form.fullName}
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
                value = {form.email}
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
                  value = {form.password}
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
                className="font-normal text-xl w-[215px] md:h-16 h-14 rounded-[15px] border border-black">
                Sign Up
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
