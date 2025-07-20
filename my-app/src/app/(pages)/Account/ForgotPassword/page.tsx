"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/account/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("If this email exists, a reset link has been sent.");
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
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="p-3 border border-gray-400 rounded focus:outline-none bg-white text-black"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded py-2 font-semibold hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {message && <p className="text-green-600 text-center mt-2">{message}</p>}
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}