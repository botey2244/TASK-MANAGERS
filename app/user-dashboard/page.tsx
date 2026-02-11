"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  // 🔐 Protect Dashboard
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      }
    })();
  }, [router]);

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    router.push("/login");
    router.refresh();
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
            >
              ☰
            </button>

            {menuOpen && (
              <div className="absolute left-0 mt-3 w-60 rounded-xl bg-white shadow-lg">
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

          <h1 className="text-4xl font-extrabold text-black">
            User Dashboard
          </h1>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/notifications")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/70 hover:bg-white"
          >
            🔔
            {notifCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {notifCount}
              </span>
            )}
          </button>

          {/* ✅ WORKING LOGOUT */}
          <button
            onClick={handleLogout}
            className="rounded-full bg-[#244a9b] px-8 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
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

      {/* Add task */}
      <div className="mt-10">
        <button
          onClick={() => router.push("/add-task")}
          className="rounded-md bg-[#6f8394] px-8 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          + Add task
        </button>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-hidden rounded-lg bg-white">
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
              <button className="font-medium text-gray-700 hover:underline">
                Edit
              </button>
            </div>
          </div>
        ))}
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
    <div className="w-44 rounded-md bg-white shadow-sm">
      <div className="bg-[#6f8394] py-2 text-center text-xs font-semibold text-black">
        {title}
      </div>
      <div className="py-4 text-center text-sm text-black">{value}</div>
    </div>
  );
}
