"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NewPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // TODO: connect backend later
    // Example: await updatePassword(newPassword)
    alert("Password updated (UI only). Redirect to login next.");
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2]">
      {/* Header logo */}
      <div className="flex items-center gap-3 px-10 pt-8">
        <div className="relative h-10 w-10">
          <Image src="/logo.png" alt="Task Manager" fill className="object-contain" />
        </div>
        <span className="text-2xl font-extrabold text-[#1b2a44] drop-shadow-sm">
          TaskManager
        </span>
      </div>

      {/* Main layout */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-6 pt-10 md:grid-cols-2 md:px-10">
        {/* Left */}
        <div>
          <h1 className="text-5xl font-extrabold text-black">Create new password!</h1>
          <p className="mt-4 max-w-md text-base text-[#243042]">
            Enter your new password.
          </p>

          <div className="relative mt-10 h-[320px] w-full">
            <Image
              src="/auth-illustration.png"
              alt="New password illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-3xl bg-[#f7eeee] p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New password */}
            <div className="space-y-3">
              <label className="block text-xl font-semibold text-black">
                New password:
              </label>
              <input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg bg-[#dcdcdc] px-5 py-4 text-base text-black placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-black/10"
                required
              />
            </div>

            {/* Confirm new password */}
            <div className="space-y-3">
              <label className="block text-xl font-semibold text-black">
                Confirm new password:
              </label>

              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg bg-[#dcdcdc] px-5 py-4 pr-12 text-base text-black placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-black/10"
                  required
                />

                {/* Eye icon */}
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                  aria-label="Toggle password visibility"
                >
                  {show ? (
                    // eye-off
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 3l18 18"
                        stroke="#111827"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                        stroke="#111827"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6.7 6.7C4.2 8.6 2.7 12 2.7 12s2.7 6 9.3 6c1.8 0 3.3-.4 4.6-1"
                        stroke="#111827"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.3 4.3c.8-.2 1.7-.3 2.7-.3 6.6 0 9.3 8 9.3 8s-.9 2-2.8 3.7"
                        stroke="#111827"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    // eye
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2.7 12s2.7-8 9.3-8 9.3 8 9.3 8-2.7 8-9.3 8-9.3-8-9.3-8Z"
                        stroke="#111827"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
                        stroke="#111827"
                        strokeWidth="1.6"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forget-password"
                  className="text-xs font-medium text-black underline underline-offset-4 hover:opacity-80"
                >
                  Forget password?
                </Link>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="rounded-full bg-[#244a9b] px-12 py-2.5 text-sm font-semibold text-white hover:opacity-95"
              >
                Login
              </button>
            </div>

            {/* Register line */}
            <p className="pt-1 text-center text-xs text-gray-800">
              Don&apos;t you have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-black underline underline-offset-4 hover:opacity-80"
              >
                Register
              </Link>
            </p>
          </form>
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
