"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Feature = {
  title: string;
  desc: string;
  bgClass: string;
};

export default function LandingPage() {
  const router = useRouter();

  const features: Feature[] = [
    {
      title: "Task control",
      desc: "Create, update, and manage tasks with clear status, priority levels, and due dates to keep work organized.",
      bgClass: "bg-pink-100",
    },
    {
      title: "Category",
      desc: "Assign tasks to categories or projects to separate different types of work and improve clarity.",
      bgClass: "bg-green-100",
    },
    {
      title: "Task Notifications",
      desc: "Get in-app notifications when tasks are updated or when deadlines are approaching.",
      bgClass: "bg-indigo-100",
    },
    {
      title: "User Authentication",
      desc: "Secure login and registration ensure that each user can safely access their own tasks and data.",
      bgClass: "bg-yellow-100",
    },
    {
      title: "Dashboard Overview",
      desc: "View task summaries, progress status, and key information directly from the dashboard.",
      bgClass: "bg-sky-100",
    },
    {
      title: "Admin Dashboard",
      desc: "Administrators can view all users, monitor tasks, manage categories, and track system statistics.",
      bgClass: "bg-orange-100",
    },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2]">
      {/* NAVBAR (fixed) */}
      <header className="fixed left-0 right-0 top-0 z-50 bg-[#cfe0f2]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/logo.png"
                alt="Task Manager logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-extrabold text-black">Task Manager</span>
          </div>

          {/* Menu */}
          <nav className="hidden items-center gap-8 text-sm font-semibold text-black md:flex">
            <button onClick={() => scrollTo("home")} className="hover:opacity-80">
              Home
            </button>
            <button onClick={() => scrollTo("features")} className="hover:opacity-80">
              Features
            </button>
            <button onClick={() => scrollTo("join")} className="hover:opacity-80">
              Join us
            </button>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-black hover:opacity-80">
              Sign in
            </Link>

            <Link
              href="/signup"
              className="rounded-full bg-[#244a9b] px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 1 — HERO (full screen) */}
      <section
        id="home"
        className="min-h-screen pt-28"
      >
        <div className="mx-auto grid h-[calc(100vh-7rem)] max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
          {/* Left */}
          <div>
            <h1 className="text-5xl font-extrabold leading-tight text-black">
              Daily Task <br /> Management
            </h1>

            <p className="mt-5 max-w-md text-base text-gray-700">
              Focus on important tasks, assign tasks, organize and prioritize your
              projects in a fun flexible, and rewarding way. Let’s started!
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/signup")}
                className="rounded-full bg-[#244a9b] px-7 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Get Started →
              </button>

              <button
                onClick={() => scrollTo("features")}
                className="rounded-full bg-white/60 px-7 py-3 text-sm font-semibold text-black hover:opacity-90"
              >
                Discover Features
              </button>
            </div>
          </div>

          {/* Right image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative h-[320px] w-[320px] md:h-[400px] md:w-[400px]">
              <Image
                src="/hero-illustration.png"
                alt="Hero image"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — FEATURES (full screen) */}
      <section id="features" className="min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
          <h2 className="text-center text-4xl font-extrabold text-black">
            Stay focused. Stay organized. Get more done.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-gray-700">
            Designed to help users organize tasks, monitor progress, and manage work
            efficiently in one place.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className={`rounded-2xl ${f.bgClass} p-6 shadow-sm`}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/70">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                      stroke="#111827"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8 8h8M8 12h8M8 16h6"
                      stroke="#111827"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h4 className="text-lg font-extrabold text-black">{f.title}</h4>
                <p className="mt-3 text-sm text-gray-700">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => scrollTo("join")}
              className="rounded-full bg-[#244a9b] px-7 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — JOIN (full screen) */}
      <section id="join" className="min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
          <div className="rounded-2xl bg-white px-8 py-10 shadow">
            <h3 className="text-center text-3xl font-extrabold text-black">
              Ready to <span className="text-orange-500">Organize</span> your remote work with us!
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-gray-700">
              Join us today and try the best project management tool in the industry.
              Ensure you’re spending where you want to be.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.push("/signup")}
                className="rounded-full bg-[#244a9b] px-7 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Get Start today →
              </button>

              <button
                onClick={() => router.push("/signup")}
                className="rounded-full bg-gray-200 px-7 py-3 text-sm font-semibold text-gray-800 hover:opacity-90"
              >
                Stay Connected
              </button>
            </div>
          </div>

          {/* Footer inside section 3 */}
          <footer className="mt-10 flex flex-col items-center justify-between gap-4 text-xs text-gray-700 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="relative h-6 w-6">
                <Image src="/logo.png" alt="Task Manager logo" fill className="object-contain" />
              </div>
              <span>Privacy Policy</span>
              <span>|</span>
              <span>Terms of Use</span>
            </div>
            <div>Copyright © 2026 TaskManager Inc. All rights reserved.</div>
          </footer>
        </div>
      </section>
    </div>
  );
}
