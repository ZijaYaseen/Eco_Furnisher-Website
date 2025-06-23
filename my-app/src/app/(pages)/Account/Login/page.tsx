"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;

        try {
            await signIn("credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: "/Dashboard",
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong");
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "google" | "facebook") => {
        setSocialLoading(provider);
        try {
            await signIn(provider, {
                callbackUrl: "/Dashboard",
                redirect: true,
            });
        } catch (error) {
            setError(`Failed to login with ${provider}, ${error}`);
            setSocialLoading(null);
        }
    };

    return (
        <div className='max-w-[1440px] font-poppins w-full'>
            <div className="w-[80%] mx-auto py-10">
                <div className="flex flex-col gap-8 md:w-[40%] w-full mx-auto">
                    <h1 className="font-semibold text-4xl">Log In</h1>

                    {error && <p className="text-red-500">{error}</p>}
                    
                    {/* Social Login Buttons */}
                    <div className="flex flex-col gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("google")}
                            disabled={isLoading || socialLoading !== null}
                            className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {socialLoading === 'google' ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                            ) : (
                                <FcGoogle size={24} />
                            )}
                            <span>{socialLoading === 'google' ? 'Signing in...' : 'Continue with Google'}</span>
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("facebook")}
                            disabled={isLoading || socialLoading !== null}
                            className="flex items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {socialLoading === 'facebook' ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            ) : (
                                <FaFacebook size={24} className="text-blue-600" />
                            )}
                            <span>{socialLoading === 'facebook' ? 'Signing in...' : 'Continue with Facebook'}</span>
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
                                disabled={isLoading || socialLoading !== null}
                                className="font-normal text-xl w-[215px] md:h-16 h-14 rounded-[15px] border border-black disabled:opacity-50"
                            >
                                {isLoading ? "Logging in..." : "Log In"}
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
