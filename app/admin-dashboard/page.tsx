"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "Pending" | "In Progress" | "Completed" | "Missing";

type UserRow = {
  id: string;
  name: string;
};

type TaskRow = {
  id: string;
  title: string;
  status: Status;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  // Demo numbers (UI only)
  const stats = [
    { title: "Total User", value: 10 },
    { title: "Total Tasks", value: 10 },
    { title: "Total categories", value: 10 },
    { title: "Active Categories", value: 10 },
  ];

  const [users] = useState<UserRow[]>([
    { id: "u1", name: "Botey" },
    { id: "u2", name: "Jing Jing" },
    { id: "u3", name: "Lina" },
    { id: "u4", name: "Thearin" },
  ]);

  const [tasks] = useState<TaskRow[]>([
    { id: "t1", title: "Project Management", status: "Pending" },
    { id: "t2", title: "Task manager", status: "In Progress" },
    { id: "t3", title: "UX/UI", status: "Completed" },
    { id: "t4", title: "Smartphone Application Analysis", status: "Missing" },
  ]);

  const taskOptions = useMemo(() => ["Task", ...tasks.map((t) => t.title)], [tasks]);
  const userOptions = useMemo(() => ["User", ...users.map((u) => u.name)], [users]);

  const [selectedTask, setSelectedTask] = useState("Task");
  const [selectedUser, setSelectedUser] = useState("User");

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Top header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          {/* Big avatar icon */}
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

          <h1 className="text-6xl font-extrabold text-black">Admin Dashboard</h1>
        </div>

        <button className="rounded-full bg-[#244a9b] px-8 py-2 text-sm font-semibold text-white hover:opacity-95">
          Logout
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-10 flex flex-wrap gap-10">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} />
        ))}
      </div>

      {/* ✅ Manage User as BUTTON */}
      <button
        onClick={() => router.push("/manage-user")}
        className="mt-12 flex items-center gap-4 rounded-lg bg-transparent hover:opacity-95"
      >
        {/* Icons */}
        <div className="flex items-center gap-2">
          {/* User icon */}
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
              stroke="#111827"
              strokeWidth="1.8"
            />
            <path
              d="M4 20c1.8-3.2 5-5 8-5"
              stroke="#111827"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          {/* Settings icon (simple) */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l1.2 2.7 2.9.4-2.1 2.1.5 2.9L12 9.9 9.6 10.1l.5-2.9L8 5.1l2.9-.4L12 2Z"
              fill="#111827"
              opacity="0.9"
            />
          </svg>
        </div>

        <span className="text-4xl font-extrabold text-black">Manage User</span>
      </button>

      {/* Filters row */}
      <div className="mt-6 flex flex-wrap items-center gap-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-black">Tasks:</span>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-64 rounded-md bg-white px-3 py-2 text-sm outline-none"
          >
            {taskOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-black">Users:</span>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-64 rounded-md bg-white px-3 py-2 text-sm outline-none"
          >
            {userOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <button className="rounded-md bg-white px-10 py-2 text-sm font-semibold text-gray-600 shadow-sm">
          Filter
        </button>
      </div>

      {/* Two tables row */}
      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Left table: Users */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-2 bg-[#5f788b] px-6 py-3 text-sm font-semibold text-black">
            <div>User</div>
            <div className="text-center">Role</div>
          </div>

          {users.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-2 border-t border-gray-300 px-6 py-4 text-sm text-gray-800"
            >
              <div>{u.name}</div>
              <div className="flex justify-center">
                <button
                onClick={() => router.push("/manage-user")}
                className="rounded-md bg-[#244a9b] px-10 py-1.5 text-xs font-semibold text-white hover:opacity-95"
            >   
                Manage
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* Right table: Tasks */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-2 bg-[#5f788b] px-6 py-3 text-sm font-semibold text-black">
            <div className="text-center">Title</div>
            <div className="text-center">Role</div>
          </div>

          {tasks.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-2 border-t border-gray-300 px-6 py-4 text-sm text-gray-800"
            >
              <div className="text-center">{t.title}</div>
              <div className="flex justify-center">
                <span className="rounded-md bg-[#244a9b] px-10 py-1.5 text-xs font-semibold text-white">
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
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

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="w-56 overflow-hidden rounded-md bg-white shadow-sm">
      <div className="bg-[#6f8394] py-2 text-center text-xs font-semibold text-black">
        {title}
      </div>
      <div className="py-6 text-center text-sm text-black">{value}</div>
    </div>
  );
}
