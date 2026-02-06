"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Data for the feature cards
const FEATURES = [
  {
    title: "Task control",
    description:
      "Create, update, and manage tasks with clear status, priority levels, and due dates to keep work organized.",
    color: "bg-[#fde7ec]", // soft pink
  },
  {
    title: "Category",
    description:
      "Assign tasks to categories or projects to separate different types of work and improve clarity.",
    color: "bg-[#dff3d1]", // light green
  },
  {
    title: "Task Notifications",
    description:
      "Get in‑app notifications when tasks are updated or when deadlines are approaching.",
    color: "bg-[#dde0fc]", // pale lilac
  },
  {
    title: "User Authentication",
    description:
      "Secure login and registration ensure that each user can safely access their own tasks and data.",
    color: "bg-[#f5f1c4]", // soft yellow
  },
  {
    title: "Dashboard Overview",
    description:
      "View task summaries, progress status, and key information directly from the dashboard.",
    color: "bg-[#def3f8]", // light aqua
  },
  {
    title: "Admin Dashboard",
    description:
      "Administrators can view all users, monitor tasks, manage categories, and track system statistics.",
    color: "bg-[#fce0e0]", // pale red
  },
];

export default function Page() {
  const router = useRouter();

  return (
    <div className="bg-[#cfe0f2] min-h-screen">
      {/* Top navigation bar */}
      <header className="flex items-center justify-between px-8 sm:px-16 md:px-24 lg:px-32 py-6">
        {/* Logo and name */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image src="/logo.png" alt="Task Manager logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-extrabold text-black">Task Manager</span>
        </div>
        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-black">
          <a href="#home" className="hover:text-[#244a9b]">Home</a>
          <a href="#about" className="hover:text-[#244a9b]">About us</a>
          <a href="#features" className="hover:text-[#244a9b]">Features</a>
          <a href="#join" className="hover:text-[#244a9b]">Join us</a>
        </nav>
        {/* Sign in / Sign up */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-[#244a9b] hover:underline">
            Sign in
          </Link>
          <Link href="/signup" className="rounded-full bg-[#244a9b] px-5 py-2 text-sm font-medium text-white hover:opacity-90">
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <section id="home" className="grid grid-cols-1 md:grid-cols-2 gap-12 px-8 sm:px-16 md:px-24 lg:px-32 py-24">
      {/* Left side: text */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-black">
            Daily Task Management
          </h1>
          <p className="mt-6 max-w-md text-lg text-gray-700">
            Focus on important tasks, assign tasks, organize and prioritize your projects in a fun flexible, and rewarding way. Let&rsquo;s started!
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#244a9b] px-7 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Get Started
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-4-4 4 4-4 4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full bg-[#e0e5f0] px-7 py-3 text-sm font-semibold text-black hover:bg-[#d5d9e4]"
            >
              Discover Features
            </button>
          </div>
        </div>
        {/* Right side: hero illustration */}
        <div className="flex items-center justify-center">
          <div className="relative h-[350px] w-full max-w-[500px]">
            <Image src="/hero-illustration.png" alt="Hero illustration" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="px-8 sm:px-16 md:px-24 lg:px-32 py-24">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-black">
          Stay focused. Stay organized. Get more done.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-center text-lg text-gray-700">
          Designed to help users organize tasks, monitor progress, and manage work efficiently in one place.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {FEATURES.map(({ title, description, color }, idx) => (
            <div key={idx} className={`flex flex-col gap-5 rounded-xl p-8 shadow-sm ${color}`}>
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" className="text-[#111827]">
                <path d="M9 4h6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
                <path d="M9 3.5h6a1.5 1.5 0 0 1 1.5 1.5v.5H7v-.5A1.5 1.5 0 0 1 8.5 3.5Z" stroke="currentColor" strokeWidth={1.6} />
                <path d="M7 5.5h10A2 2 0 0 1 19 7.5v12A2 2 0 0 1 17 21.5H7A2 2 0 0 1 5 19.5v-12A2 2 0 0 1 7 5.5Z" stroke="currentColor" strokeWidth={1.6} />
                <path d="M8 10h8M8 13h8M8 16h6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
              </svg>
              <h3 className="text-lg font-extrabold text-black">{title}</h3>
              <p className="text-sm text-gray-800">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call‑to‑action section */}
      <section id="join" className="px-8 sm:px-16 md:px-24 lg:px-32 py-24">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white p-12 text-center shadow">
          {/* Wavy background */}
          <Image src="/wave-bg.png" alt="Wave background" fill className="absolute inset-0 object-cover opacity-50 pointer-events-none" />
          <h3 className="relative z-10 text-3xl md:text-4xl font-extrabold text-black">
            Ready to <span className="text-orange-500">Organize</span> your remote work with us!
          </h3>
          <p className="relative z-10 mt-5 text-lg text-gray-700">
            Join us today and try the best project management tool in the industry. Ensure you’re spending where you want to be.
          </p>
          <div className="relative z-10 mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/signup")}
              className="inline-flex items-center gap-2 rounded-full bg-[#244a9b] px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Get Start today
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-4-4 4 4-4 4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="rounded-full bg-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-400">
              Stay Connected
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 sm:px-16 md:px-24 lg:px-32 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6">
            <Image src="/logo.png" alt="Task Manager logo" fill className="object-contain" />
          </div>
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
          <span className="mx-1">|</span>
          <span className="cursor-pointer hover:underline">Terms of Use</span>
        </div>
        <p className="text-center sm:text-left">
          Copyright © 2026 TaskManager Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
