"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return alert("Please enter title");
    if (!category.trim()) return alert("Please enter category");
    if (!priority.trim()) return alert("Please enter priority");
    if (!dueDate) return alert("Please select due date");

    // TODO: connect database later
    alert("Saved (UI only). Going back to dashboard...");

    router.push("/user-dashboard");
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-10 pt-10">
        <div className="flex items-center gap-5">
          {/* clipboard icon */}
          <div className="flex h-16 w-16 items-center justify-center">
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 4h6"
                stroke="#111827"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M9 3.5h6a1.5 1.5 0 0 1 1.5 1.5v.5H7v-.5A1.5 1.5 0 0 1 8.5 3.5Z"
                stroke="#111827"
                strokeWidth="1.6"
              />
              <path
                d="M7 5.5h10A2 2 0 0 1 19 7.5v12A2 2 0 0 1 17 21.5H7A2 2 0 0 1 5 19.5v-12A2 2 0 0 1 7 5.5Z"
                stroke="#111827"
                strokeWidth="1.6"
              />
              <path
                d="M8 10h8M8 13h8M8 16h6"
                stroke="#111827"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="text-5xl font-extrabold text-black">Add Task</h1>
        </div>

        <button className="rounded-full bg-[#244a9b] px-8 py-2 text-sm font-semibold text-white hover:opacity-95">
          Logout
        </button>
      </div>

      {/* Card */}
      <div className="mx-auto mt-14 max-w-3xl rounded-3xl bg-[#f7eeee] px-16 py-14 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-black">Title:</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 text-sm text-black placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-black">Description:</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 text-sm text-black placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-lg font-semibold text-black">Category:</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 text-sm text-black placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold text-black">Priority:</label>
              <input
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="Enter priority"
                className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 text-sm text-black placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-black">Due Date:</label>

            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 pr-12 text-sm text-black outline-none focus:ring-2 focus:ring-black/10"
              />

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-80">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 2v3M17 2v3"
                    stroke="#111827"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 7h16"
                    stroke="#111827"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 4h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                    stroke="#111827"
                    strokeWidth="1.6"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-6 pt-4">
            <button
              type="submit"
              className="rounded-full bg-[#244a9b] px-10 py-2.5 text-sm font-semibold text-white hover:opacity-95"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => router.push("/user-dashboard")}
              className="rounded-full bg-[#244a9b] px-10 py-2.5 text-sm font-semibold text-white hover:opacity-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Bottom note with YOUR LOGO */}
      <div className="mt-20 flex items-center justify-center gap-3 pb-6 text-xs text-gray-700">
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
