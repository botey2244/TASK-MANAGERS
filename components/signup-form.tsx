"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-md px-8 py-8">
      <h2 className="text-2xl font-extrabold text-center text-gray-900">
        Create an account
      </h2>
      <p className="text-center text-sm text-gray-500 mt-2">
        Get started with your free account today
      </p>

      <form onSubmit={handleSignup} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-300"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-300"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black py-3 text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-center text-sm text-gray-500 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-gray-800 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
