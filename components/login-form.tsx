"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    const cleanEmail = email.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    // ✅ success
    router.push("/user-dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-[520px] bg-white rounded-3xl shadow-xl px-12 py-12">
      <h2 className="text-3xl font-extrabold text-center text-gray-900">
        Welcome back
      </h2>

      <p className="text-center text-base text-gray-500 mt-3">
        Login to your account
      </p>

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-xl border border-gray-200 px-5 py-3 text-base outline-none focus:border-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-xl border border-gray-200 px-5 py-3 text-base outline-none focus:border-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <div className="mt-3 text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-black py-4 text-white text-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-base text-gray-500 pt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-gray-800 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
