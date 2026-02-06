"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Notification = {
  id: string;
  title: string;
  time: string;
  category: string;
  isRead: boolean;
};

export default function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Task deadline approaching - Assignment",
      time: "Today",
      category: "Assignment",
      isRead: false,
    },
    {
      id: "2",
      title: "Task status updated - Project Work",
      time: "Today",
      category: "Project",
      isRead: false,
    },
    {
      id: "3",
      title: "New task created - Research Paper",
      time: "Yesterday",
      category: "Research",
      isRead: false,
    },
    {
      id: "4",
      title: "New Assignment - Database",
      time: "Apr 12",
      category: "Assignment",
      isRead: false,
    },
    {
      id: "5",
      title: "New Assignment - Data Structure",
      time: "Apr 11",
      category: "Assignment",
      isRead: false,
    },
  ]);

  const categories = useMemo(
    () => Array.from(new Set(notifications.map((n) => n.category))),
    [notifications]
  );

  const [selected, setSelected] = useState("");
  const [filterApplied, setFilterApplied] = useState("");

  const filtered = useMemo(() => {
    if (!filterApplied) return notifications;
    return notifications.filter((n) => n.category === filterApplied);
  }, [notifications, filterApplied]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const go = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Top bar */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-5">
          {/* Hamburger */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 hover:bg-white"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="#111827" strokeWidth="2" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute left-0 mt-3 w-60 rounded-xl bg-white shadow-lg">
                <NavItem
                  label="User Dashboard"
                  active={pathname === "/user-dashboard"}
                  onClick={() => go("/user-dashboard")}
                />
                <NavItem
                  label="Category Manager"
                  active={pathname === "/category-manager"}
                  onClick={() => go("/category-manager")}
                />
                <NavItem
                  label="Notifications"
                  active={pathname === "/notifications"}
                  onClick={() => go("/notifications")}
                />
              </div>
            )}
          </div>

          {/* Bell icon */}
          <div className="flex h-14 w-14 items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 22Z"
                fill="#111827"
              />
              <path
                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
                fill="#111827"
              />
            </svg>
          </div>

          <h1 className="text-5xl font-extrabold text-black">Notifications</h1>
        </div>

        <button className="rounded-full bg-[#244a9b] px-8 py-2 text-sm font-semibold text-white hover:opacity-95">
          Logout
        </button>
      </div>

      {/* Section title */}
      <h2 className="mt-10 text-3xl font-extrabold text-black">Notifications:</h2>

      {/* Filter */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-medium text-black">Notifications:</span>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-64 rounded-md bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="">Work/Home/Shop...</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={() => setFilterApplied(selected)}
          className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm"
        >
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-sm border border-black/50 bg-white">
        {filtered.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between border-b border-black/40 px-6 py-4 last:border-b-0"
          >
            <div className="flex items-start gap-5">
              <div className="mt-1 h-3 w-3 rounded-full border border-black" />
              <div>
                <p className="text-sm text-black">{n.title}</p>
                <p className="text-[11px] text-gray-600">{n.time}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => markAsRead(n.id)}
                className="rounded-md bg-[#244a9b] px-4 py-1 text-[11px] font-semibold text-white"
              >
                Mark as read
              </button>
              <button
                onClick={() => router.push("/task-details")}
                className="rounded-md bg-[#244a9b] px-4 py-1 text-[11px] font-semibold text-white"
              >
                View Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty text (as in Figma) */}
      <div className="mt-14 text-center">
        <p className="text-sm font-medium text-black">You have no new notifications</p>
        <p className="mt-2 text-[11px] text-gray-700">No notifications to display</p>
      </div>

      {/* Footer */}
      <div className="mt-16 flex items-center justify-center gap-3 text-xs text-gray-700">
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

function NavItem({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50 ${
        active ? "bg-gray-50" : ""
      }`}
    >
      {label}
    </button>
  );
}
