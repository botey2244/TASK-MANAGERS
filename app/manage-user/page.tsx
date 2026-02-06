"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManageUserPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [action, setAction] = useState("View/Change Role");

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only for now
    alert("Saved (UI only)");
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Back */}
      <button
        onClick={() => router.push("/admin-dashboard")}
        className="flex items-center gap-2 text-sm font-semibold text-black hover:opacity-80"
      >
        <span className="text-xl">←</span> Manage User
      </button>

      {/* Center avatar + title */}
      <div className="mt-6 flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
              fill="#fff"
              opacity="0.95"
            />
            <path
              d="M4 20c1.8-3.2 5-5 8-5s6.2 1.8 8 5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="mt-4 text-4xl font-extrabold text-black">User info</h1>
      </div>

      {/* Card */}
      <form onSubmit={onSave} className="mx-auto mt-8 w-full max-w-2xl">
        <div className="rounded-2xl bg-[#fff6f6] px-12 py-10 shadow-sm">
          {/* User Id */}
          <label className="block text-sm font-semibold text-black">
            User_Id:
          </label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your id"
            className="mt-2 w-full rounded-md bg-[#e7e7e7] px-4 py-3 text-sm outline-none"
          />

          {/* Full Name */}
          <label className="mt-6 block text-sm font-semibold text-black">
            Full Name:
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="mt-2 w-full rounded-md bg-[#e7e7e7] px-4 py-3 text-sm outline-none"
          />

          {/* Email */}
          <label className="mt-6 block text-sm font-semibold text-black">
            Email:
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-2 w-full rounded-md bg-[#e7e7e7] px-4 py-3 text-sm outline-none"
          />

          {/* Role + Status row */}
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-black">
                Role:
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter your role"
                className="mt-2 w-full rounded-md bg-[#e7e7e7] px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black">
                Status:
              </label>
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Enter your status"
                className="mt-2 w-full rounded-md bg-[#e7e7e7] px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <label className="mt-6 block text-sm font-semibold text-black">
            Actions
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-md bg-[#e7e7e7] px-4 py-3">
            <input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />

            {/* small icon at right */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 11a4 4 0 1 0-8 0"
                stroke="#111827"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M6 20c1.5-3 4.2-4.5 6-4.5s4.5 1.5 6 4.5"
                stroke="#111827"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-6">
            <button
              type="submit"
              className="rounded-full bg-[#244a9b] px-10 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin-dashboard")}
              className="rounded-full bg-[#244a9b] px-10 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-12 flex items-center justify-center gap-3 text-xs text-gray-700">
        <div className="relative h-6 w-6">
          <Image src="/logo.png" alt="Task Manager logo" fill className="object-contain" />
        </div>
        <p>
          This page is protected to ensure you&apos;re not a bot.{" "}
          <span className="text-red-500">Learn more</span>
        </p>
      </div>
    </div>
  );
}
