"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";


const Register = () => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const res = await fetch("/api/account/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, fullName, password }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.error || "Registration failed");
                setIsLoading(false);
                return;
            }
            // Success
            router.push("/Dashboard");
        } catch (error) {
            console.log(error);
            setError("Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <div className='max-w-[1440px] font-poppins w-full' >


            <div className="flex flex-col md:flex-row justify-between w-[80%] mx-auto py-10">

                {/* Register */}
                <div className="flex flex-col gap-8 md:w-[40%] w-full mx-auto">
                    <h1 className="font-semibold text-4xl">Register</h1>

                    <form method="POST" className="flex flex-col gap-7" onSubmit={handleRegister}>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="fullName" className="text-base font-medium">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="mt-1 p-6 border border-gray-400 md:w-[453px] lg:h-[75px] h-12 rounded-[10px] focus:outline-none bg-white text-black"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="email" className="text-base font-medium">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 p-6 border border-gray-400 md:w-[453px] lg:h-[75px] h-12 rounded-[10px] focus:outline-none bg-white text-black"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="password" className="text-base font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 p-6 border border-gray-400 md:w-[453px] lg:h-[75px] h-12 rounded-[10px] focus:outline-none bg-white text-black"
                                required
                            />
                        </div>
                        {error && <p className="text-red-600 font-semibold text-base mt-2">{error}</p>}
                        <div className="flex items-center md:mt-15">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="font-normal text-xl w-[215px] md:h-16 h-14 rounded-[15px] border border-black bg-black text-white hover:bg-gray-900 disabled:opacity-50"
                            >
                                {isLoading ? "Registering..." : "Register"}
                            </button>
                        </div>
                    </form>

                </div>

            </div>

        </div>
    )
}

export default Register