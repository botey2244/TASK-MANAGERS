"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [cooldown, setCooldown] = useState(60);

  // countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const resend = async () => {
    if (!email) {
      setErrorMsg("Please enter your email.");
      return;
    }
    if (cooldown > 0) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/new-password`,
    });

    setLoading(false);

    if (error) {
      const msg = error.message || "Something went wrong.";
      setErrorMsg(msg);

      // If you hit Supabase rate-limit, force longer wait
      if (msg.toLowerCase().includes("too many") || msg.toLowerCase().includes("rate")) {
        setCooldown(180);
      } else {
        setCooldown(60);
      }
      return;
    }

    setSuccessMsg("✅ Reset link sent again! Please check your email.");
    setCooldown(60);
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2]">
      {/* Header logo */}
      <div className="flex items-center gap-3 px-10 pt-8">
        <div className="relative h-10 w-10">
          <Image src="/logo.png" alt="Task Manager" fill className="object-contain" />
        </div>
        <span className="text-2xl font-extrabold text-[#1b2a44] drop-shadow-sm">
          Task Manager
        </span>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-6 pt-10 md:grid-cols-2 md:px-10">
        {/* Left */}
        <div>
          <h1 className="text-5xl font-extrabold text-black">Reset Password!</h1>
          <p className="mt-4 max-w-md text-base text-[#243042]">
            We&apos;ve sent a reset link to your email. <br className="hidden md:block" />
            Open your inbox and click the link.
          </p>

          <div className="relative mt-10 h-[320px] w-full">
            <Image
              src="/auth-illustration.png"
              alt="Reset password illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-3xl bg-[#f7eeee] p-10 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-semibold text-black">Check your email</h2>

            <div className="mt-6 w-full space-y-3 text-left">
              <label className="block text-xl font-bold text-black">Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-[#dcdcdc] px-5 py-4 text-base text-black placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            {/* messages */}
            {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}
            {successMsg && <p className="mt-4 text-sm text-green-700">{successMsg}</p>}

            <p className="mt-4 text-xs text-gray-700">
              Didn&apos;t get the email?{" "}
              <button
                type="button"
                onClick={resend}
                disabled={loading || cooldown > 0}
                className="font-semibold text-red-500 hover:underline disabled:opacity-60"
              >
                Resend
              </button>
            </p>

            <p className="mt-2 text-[11px] text-gray-700">
              {cooldown > 0 ? `You can resend in ${cooldown}s` : "You can resend now."}
            </p>

            <button
              type="button"
              onClick={resend}
              disabled={loading || cooldown > 0}
              className="mt-6 rounded-full bg-[#244a9b] px-12 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
            >
              {cooldown > 0 ? `Wait ${cooldown}s` : loading ? "Sending..." : "Send reset link"}
            </button>

            <Link
              href="/login"
              className="mt-4 text-sm font-medium text-black underline underline-offset-4 hover:opacity-80"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-6 flex items-center justify-center gap-3 pb-6 text-xs text-gray-700">
        <div className="relative h-6 w-6">
          <Image src="/logo.png" alt="note icon" fill className="object-contain" />
        </div>
        <p>
          This page is protected to ensure you&apos;re not a bot.{" "}
          <span className="text-red-500">Learn more</span>
        </p>
      </div>
    </div>
  );
}
