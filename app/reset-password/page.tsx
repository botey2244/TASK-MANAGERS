"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const code = useMemo(() => otp.join(""), [otp]);

  // countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const mm = String(m);
    const ss = s.toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const focusIndex = (i: number) => {
    inputsRef.current[i]?.focus();
    inputsRef.current[i]?.select();
  };

  const handleChange = (i: number, value: string) => {
    const v = value.replace(/\D/g, ""); // only digits
    if (!v) {
      const next = [...otp];
      next[i] = "";
      setOtp(next);
      return;
    }

    // If user pastes multiple digits into one box, spread them
    const digits = v.split("").slice(0, 6 - i);
    const next = [...otp];
    for (let k = 0; k < digits.length; k++) {
      next[i + k] = digits[k];
    }
    setOtp(next);

    const nextIndex = Math.min(i + digits.length, 5);
    focusIndex(nextIndex);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[i]) {
        const next = [...otp];
        next[i] = "";
        setOtp(next);
        return;
      }
      if (i > 0) focusIndex(i - 1);
    }

    if (e.key === "ArrowLeft" && i > 0) focusIndex(i - 1);
    if (e.key === "ArrowRight" && i < 5) focusIndex(i + 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;

    e.preventDefault();
    const digits = text.split("");
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setOtp(next);
    focusIndex(Math.min(digits.length - 1, 5));
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: connect your backend verify logic here
    // Example:
    // await verifyResetCode(code)
    alert(`Verify code: ${code}`);
  };

  const handleResend = () => {
    // TODO: connect resend logic here
    setSecondsLeft(60);
    alert("Resent code (UI only).");
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

      {/* Main layout */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-6 pt-10 md:grid-cols-2 md:px-10">
        {/* Left */}
        <div>
          <h1 className="text-5xl font-extrabold text-black">Reset Password!</h1>
          <p className="mt-4 max-w-md text-base text-[#243042]">
            We&apos;ve send a 6-digit code to <br className="hidden md:block" />
            verify your email address.
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
          <form onSubmit={handleVerify} className="flex flex-col items-center">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center">
              {/* Simple lock icon (SVG) */}
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-80"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10V8a5 5 0 0 1 10 0v2"
                  stroke="#111827"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M7.5 10h9A2.5 2.5 0 0 1 19 12.5v6A2.5 2.5 0 0 1 16.5 21h-9A2.5 2.5 0 0 1 5 18.5v-6A2.5 2.5 0 0 1 7.5 10Z"
                  stroke="#111827"
                  strokeWidth="1.6"
                />
                <path
                  d="M12 14v3"
                  stroke="#111827"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="mt-2 text-3xl font-semibold text-black">Check your email</h2>

            {/* OTP boxes */}
            <div className="mt-6 flex gap-3">
              {otp.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  inputMode="numeric"
                  maxLength={6}
                  value={val}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className="h-10 w-10 rounded-md border border-gray-500 bg-transparent text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-black/10"
                />
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-700">
              Didn&apos;t get the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                className="font-semibold text-red-500 hover:underline"
              >
                Resend
              </button>
            </p>

            <p className="mt-3 text-[11px] text-gray-700">Expires in {formatTime(secondsLeft)}</p>

            <button
              type="submit"
              disabled={code.length !== 6}
              className="mt-5 rounded-full bg-[#244a9b] px-10 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
            >
              verify
            </button>

            <Link
              href="/forget-password"
              className="mt-3 text-[11px] font-medium text-red-500 hover:underline"
            >
              Back?
            </Link>
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
