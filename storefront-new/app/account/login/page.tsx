"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { medusaStoreApi } from "@/lib/medusa-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      try {
        const response = await medusaStoreApi.loginCustomer(email, password);
        console.log("Login success:", response);
        router.push("/account/profile");
      } catch (error: any) {
        console.uaserror("Login error:", error);
        setError(error.message || "Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-primary text-white p-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?{" "}
        <a href="/account/register" className="text-primary underline">
          Register
        </a>
      </p>
      <p className="mt-2">
        <a href="/account/reset-password" className="text-primary underline">
          Forgot password?
        </a>
      </p>
    </div>
  );
}