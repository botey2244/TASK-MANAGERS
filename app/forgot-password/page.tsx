"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect backend later (send reset code to email)
    // For now we just test UI
    alert(`Reset code will be sent to: ${email}`);
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2]">
      {/* Top: back to website */}
      <div className="px-8 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-black hover:opacity-80"
        >
          <span className="text-lg">←</span>
          Back to website
        </Link>
      </div>

      {/* Header logo */}
      <div className="flex items-center gap-3 px-10 pt-4">
        <div className="relative h-10 w-10">
          <Image src="/logo.png" alt="Task Manager" fill className="object-contain" />
        </div>
        <span className="text-2xl font-extrabold text-[#1b2a44] drop-shadow-sm">
          Task Manager
        </span>
      </div>

      {/* Main layout */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-6 pt-10 md:grid-cols-2 md:px-10">
        {/* Left */}
        <div>
          <h1 className="text-5xl font-extrabold text-black">Forget Password!</h1>
          <p className="mt-4 max-w-md text-base text-[#243042]">
            Enter your email and we’ll send you <br className="hidden md:block" />
            a code to reset it.
          </p>

          <div className="relative mt-10 h-[320px] w-full">
            <Image
              src="/auth-illustration.png"
              alt="Forget password illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-3xl bg-[#f7eeee] p-10 shadow-sm">
          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-xl font-bold text-black">Email:</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-[#dcdcdc] px-5 py-4 text-base text-black placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-black/10"
                required
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="rounded-full bg-[#244a9b] px-10 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Send a reset code
              </button>
            </div>

            <div className="flex justify-center">
              <Link
                href="/login"
                className="text-sm font-medium text-black underline underline-offset-4 hover:opacity-80"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-6 flex items-center justify-center gap-3 pb-6 text-xs text-gray-700">
        <div className="relative h-6 w-6">
          <Image src="/logo.png" alt="note icon" fill className="object-contain" />
        </div>
        <p>
          This page is protected to ensure you're not a bot.{" "}
          <span className="text-red-500">Learn more</span>
        </p>
      </div>
    </div>
  );
}
