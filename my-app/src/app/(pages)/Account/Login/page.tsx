"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;

        try {
            const res = await fetch('/api/account/login', {
                credentials: 'include',
                method: "POST",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Invalid Email or Password");
                return;
            }

            window.location.href = "/Dashboard"; // Safe Redirect

        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong");
        }
    };

    return (
        <div className='max-w-[1440px] font-poppins w-full'>
            <div className="w-[80%] mx-auto py-10">
                <div className="flex flex-col gap-8 md:w-[40%] w-full mx-auto">
                    <h1 className="font-semibold text-4xl">Log In</h1>

                    {error && <p className="text-red-500">{error}</p>}
                    <form className="flex flex-col gap-7" onSubmit={handleLogin}>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-base font-medium">
                                Enter Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 p-6 border border-[#9F9F9F] md:w-[453px] lg:h-[75px] h-12 rounded-[10px] focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-base font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="mt-1 p-6 border border-[#9F9F9F] w-full md:w-[453px] lg:h-[75px] h-12 rounded-[10px] focus:outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 md:right-6 right-4 flex items-center text-gray-500 focus:outline-none"
                                >
                                    {showPassword ? <PiEyeThin size={24} /> : <PiEyeSlashThin size={24} />}
                                </button>
                            </div>

                            <Link href={"/Account/Register"}>
                                <p className="font-light md:text-base text-xs text-blue-600 underline">
                                    Forgot Your Password?
                                </p>
                            </Link>
                        </div>

                        <div className="grid gap-4">
                            <button
                                type="submit"
                                className="font-normal text-xl w-[215px] md:h-16 h-14 rounded-[15px] border border-black"
                            >
                                Log In
                            </button>

                            <Link href={"/Account/Sign-up"}>
                                Don&#39;t have an account? <span className="border-b text-base w-36 text-blue-600 border-blue-600">Sign Up</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
