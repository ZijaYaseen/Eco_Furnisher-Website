"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordClient() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/account/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Password reset successful! You can now log in.");
        setTimeout(() => router.push("/Account/Login?reset=success"), 2000);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="p-3 border border-gray-400 rounded focus:outline-none bg-white text-black"
            placeholder="Enter new password"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded py-2 font-semibold hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {message && <p className="text-green-600 text-center mt-2">{message}</p>}
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
} 