"use client";

import Image from "next/image";
import Link from "next/link";

export default function ResetSuccessPage() {
  return (
    <div className="min-h-screen bg-[#cfe0f2]">
      {/* Header */}
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
          <h1 className="text-5xl font-extrabold text-black">Password Updated!</h1>
          <p className="mt-4 max-w-md text-base text-[#243042]">
            Your password has been successfully changed.
          </p>

          <div className="relative mt-10 h-[320px] w-full">
            <Image
              src="/auth-illustration.png"
              alt="Success illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-3xl bg-[#f7eeee] p-10 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-black">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="#111827"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="mt-6 text-3xl font-semibold text-black">
              Password reset successful
            </h2>

            <p className="mt-3 max-w-sm text-sm text-gray-700">
              You can now sign in using your new password.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex rounded-full bg-[#244a9b] px-12 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
              Go to Sign In
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
