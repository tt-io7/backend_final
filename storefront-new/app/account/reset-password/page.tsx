"use client";

import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("/store/customers/password-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": "pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c"
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to request password reset");
      }

      setMessage("Password reset link sent to your email.");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}
        <button type="submit" className="w-full bg-primary text-white p-2 rounded">
          Send Reset Link
        </button>
      </form>
      <p className="mt-4">
        Remembered your password?{" "}
        <a href="/account/login" className="text-primary underline">
          Login
        </a>
      </p>
    </div>
  );
}