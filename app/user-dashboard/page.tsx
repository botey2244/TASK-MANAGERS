"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type TaskStatus = "Pending" | "In Progress" | "Completed" | "Missing";
type TaskPriority = "High" | "Medium" | "Low";

type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
};

export default function UserDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // UI-only notification count (you can connect real data later)
  const [notifCount] = useState(2);

  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Task1",
      priority: "High",
      dueDate: "01 29, 2026",
      status: "Pending",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<"" | TaskStatus>("");
  const [filterPriority, setFilterPriority] = useState<"" | TaskPriority>("");

  const counts = useMemo(() => {
    const c = { Pending: 0, "In Progress": 0, Completed: 0, Missing: 0 };
    for (const t of tasks) c[t.status]++;
    return c;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const okStatus = filterStatus ? t.status === filterStatus : true;
      const okPri = filterPriority ? t.priority === filterPriority : true;
      return okStatus && okPri;
    });
  }, [tasks, filterStatus, filterPriority]);

  const go = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Hamburger */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 hover:bg-white"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute left-0 mt-3 w-60 overflow-hidden rounded-xl bg-white shadow-lg">
                <MenuItem
                  active={pathname === "/user-dashboard"}
                  onClick={() => go("/user-dashboard")}
                  label="User Dashboard"
                />
                <MenuItem
                  active={pathname === "/category-manager"}
                  onClick={() => go("/category-manager")}
                  label="Category Manager"
                />
                <MenuItem
                  active={pathname === "/notifications"}
                  onClick={() => go("/notifications")}
                  label="Notifications"
                />
              </div>
            )}
          </div>

          {/* avatar icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
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

          <h1 className="text-4xl font-extrabold text-black">User Dashboard</h1>
        </div>

        {/* Right actions: Bell + Logout */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/notifications")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/70 hover:bg-white"
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 22Z"
                fill="#111827"
              />
              <path
                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
                stroke="#111827"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {notifCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {notifCount}
              </span>
            )}
          </button>

          <button className="rounded-full bg-[#244a9b] px-8 py-2 text-sm font-semibold text-white hover:opacity-95">
            Logout
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-10 flex flex-wrap gap-10">
        <StatCard title="Pending" value={counts["Pending"]} />
        <StatCard title="In Progress" value={counts["In Progress"]} />
        <StatCard title="Completed" value={counts["Completed"]} />
        <StatCard title="Missing" value={counts["Missing"]} />
      </div>

      {/* Add task -> go to page */}
      <div className="mt-10">
        <button
          onClick={() => router.push("/add-task")}
          className="rounded-md bg-[#6f8394] px-8 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          + Add task
        </button>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-black">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-56 rounded-md bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Missing">Missing</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-black">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="w-56 rounded-md bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="">Category</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button
          onClick={() => alert("Filtered (UI only).")}
          className="rounded-md bg-white px-10 py-2 text-sm font-semibold text-gray-600 shadow-sm"
        >
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-hidden rounded-lg">
        <div className="grid grid-cols-5 bg-[#5f788b] px-6 py-3 text-sm font-semibold text-black">
          <div>Title</div>
          <div className="text-center">Priority</div>
          <div className="text-center">Due Date</div>
          <div className="text-center">Status</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="bg-white">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-5 border-t border-gray-300 px-6 py-4 text-sm text-gray-800"
            >
              <div>{t.title}</div>
              <div className="text-center">{t.priority}</div>
              <div className="text-center">{t.dueDate}</div>
              <div className="text-center">{t.status}</div>
              <div className="text-center">
                <button
                  className="font-medium text-gray-700 hover:underline"
                  onClick={() => alert("Edit (UI only)")}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}

          {/* Empty rows like your UI */}
          <div className="grid grid-cols-5 border-t border-gray-300 px-6 py-10 text-sm text-gray-400">
            <div>&nbsp;</div>
            <div className="text-center">&nbsp;</div>
            <div className="text-center">&nbsp;</div>
            <div className="text-center">&nbsp;</div>
            <div className="text-center">&nbsp;</div>
          </div>
          <div className="grid grid-cols-5 border-t border-gray-300 px-6 py-10 text-sm text-gray-400">
            <div>&nbsp;</div>
            <div className="text-center">&nbsp;</div>
            <div className="text-center">&nbsp;</div>
            <div className="text-center">&nbsp;</div>
            <div className="text-center">&nbsp;</div>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-10 flex items-center justify-center gap-3 text-xs text-gray-700">
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

function MenuItem({
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

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="w-44 overflow-hidden rounded-md bg-white shadow-sm">
      <div className="bg-[#6f8394] py-2 text-center text-xs font-semibold text-black">
        {title}
      </div>
      <div className="py-4 text-center text-sm text-black">{value}</div>
    </div>
  );
}
