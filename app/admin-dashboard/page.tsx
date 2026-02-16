"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type TaskStatus = "Pending" | "In Progress" | "Completed" | "Missing";

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  status: string | null;
};

type TaskRow = {
  id: string;
  user_id: string;
  title: string;
  status: TaskStatus;
  category: string | null;
  created_at?: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [users, setUsers] = useState<UserRow[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);

  // search + selected user
  const [searchUser, setSearchUser] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // extra: search task title
  const [searchTask, setSearchTask] = useState("");

  // ✅ Admin protect + load data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data: sessionData } = await supabase.auth.getSession();
      const me = sessionData.session?.user;

      if (!me) {
        router.push("/login");
        return;
      }

      const email = (me.email ?? "").toLowerCase();
      if (!email.endsWith("@admin.com")) {
        router.push("/user-dashboard");
        return;
      }

      await Promise.all([loadUsers(), loadTasks()]);
      setLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from("users") // ✅ public.users
      .select("id,email,full_name,role,status")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setUsers([]);
      return;
    }

    const list = (data as UserRow[]) || [];
    setUsers(list);

    if (!selectedUserId && list.length > 0) {
      setSelectedUserId(list[0].id);
    }
  };

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("id,user_id,title,status,category,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setTasks([]);
      return;
    }

    setTasks((data as TaskRow[]) || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // ✅ filter users by name/email
  const filteredUsers = useMemo(() => {
    const q = searchUser.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const name = (u.full_name ?? "").toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [users, searchUser]);

  // ✅ tasks for selected user
  const selectedUserTasksRaw = useMemo(() => {
    if (!selectedUserId) return [];
    return tasks.filter((t) => t.user_id === selectedUserId);
  }, [tasks, selectedUserId]);

  // ✅ filter tasks by title search
  const selectedUserTasks = useMemo(() => {
    const q = searchTask.trim().toLowerCase();
    if (!q) return selectedUserTasksRaw;
    return selectedUserTasksRaw.filter((t) =>
      (t.title ?? "").toLowerCase().includes(q)
    );
  }, [selectedUserTasksRaw, searchTask]);

  // ✅ categories for selected user
  const totalUserCategories = useMemo(() => {
    const set = new Set<string>();
    for (const t of selectedUserTasksRaw) {
      const c = (t.category ?? "").trim();
      if (c) set.add(c);
    }
    return set;
  }, [selectedUserTasksRaw]);

  // ✅ active categories (have tasks NOT completed)
  const activeUserCategories = useMemo(() => {
    const set = new Set<string>();
    for (const t of selectedUserTasksRaw) {
      const c = (t.category ?? "").trim();
      if (!c) continue;
      if (t.status !== "Completed") set.add(c);
    }
    return set;
  }, [selectedUserTasksRaw]);

  // ✅ status counts for selected user
  const statusCounts = useMemo(() => {
    const counts = {
      total: selectedUserTasksRaw.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      missing: 0,
    };

    for (const t of selectedUserTasksRaw) {
      if (t.status === "Pending") counts.pending++;
      else if (t.status === "In Progress") counts.inProgress++;
      else if (t.status === "Completed") counts.completed++;
      else if (t.status === "Missing") counts.missing++;
    }

    return counts;
  }, [selectedUserTasksRaw]);

  // ✅ stats cards
  const stats = useMemo(() => {
    return [
      { title: "Total User", value: users.length },

      // For selected user:
      { title: "Total Tasks", value: statusCounts.total },
      { title: "Pending", value: statusCounts.pending },
      { title: "In Progress", value: statusCounts.inProgress },
      { title: "Completed", value: statusCounts.completed },
      { title: "Missing", value: statusCounts.missing },

      { title: "Total Categories", value: totalUserCategories.size },
      { title: "Active Categories", value: activeUserCategories.size },
    ];
  }, [
    users.length,
    statusCounts,
    totalUserCategories.size,
    activeUserCategories.size,
  ]);

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
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

        <button
          onClick={handleLogout}
          className="rounded-full bg-[#244a9b] px-8 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Logout
        </button>
      </div>

      {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}
      {loading && <p className="mt-4 text-sm text-gray-700">Loading...</p>}

      {/* Stat cards */}
      <div className="mt-10 flex flex-wrap gap-6">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} />
        ))}
      </div>

      {/* Manage User title */}
      <div className="mt-12 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
              stroke="#111827"
              strokeWidth="1.8"
            />
            <path
              d="M4 20c1.8-3.2 5-5 8-5s6.2 1.8 8 5"
              stroke="#111827"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M19.2 8.8l.8-1.4 1.6.2-.9 1.4.9 1.4-1.6.2-.8-1.4-1.6.2.9-1.4-.9-1.4 1.6-.2Z"
              fill="#111827"
              opacity="0.9"
            />
          </svg>
        </div>
        <h2 className="text-4xl font-extrabold text-black">Manage User</h2>
      </div>

      {/* Search + Dropdown + Manage */}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        {/* Search User */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-black">Search user:</span>
          <input
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Type name or email..."
            className="w-80 rounded-md bg-white px-3 py-2 text-sm outline-none"
          />
        </div>

        {/* Select User */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-black">Users:</span>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-80 rounded-md bg-white px-3 py-2 text-sm outline-none"
          >
            {filteredUsers.length === 0 ? (
              <option value="">No users</option>
            ) : (
              filteredUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.email || u.id}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Manage Button */}
        <button
          onClick={() => {
            if (!selectedUserId) return;
            router.push(`/manage-user?uid=${selectedUserId}`);
          }}
          className="rounded-md bg-[#244a9b] px-10 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Manage
        </button>
      </div>

      {/* ✅ Search task title */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm font-medium text-black">Search task:</span>
        <input
          value={searchTask}
          onChange={(e) => setSearchTask(e.target.value)}
          placeholder="Type task title..."
          className="w-80 rounded-md bg-white px-3 py-2 text-sm outline-none"
        />
      </div>

      {/* Tables row */}
      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Users table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-3 bg-[#5f788b] px-6 py-3 text-sm font-semibold text-black">
            <div>User</div>
            <div className="text-center">Role</div>
            <div className="text-center">Action</div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="px-6 py-10 text-sm text-gray-600">
              No users found.
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-3 border-t border-gray-300 px-6 py-4 text-sm text-gray-800"
              >
                <div className="truncate">{u.full_name || u.email || u.id}</div>
                <div className="text-center">{u.role ?? "user"}</div>
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push(`/manage-user?uid=${u.id}`)}
                    className="rounded-md bg-[#244a9b] px-8 py-1.5 text-xs font-semibold text-white hover:opacity-95"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tasks table (selected user) */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-2 bg-[#5f788b] px-6 py-3 text-sm font-semibold text-black">
            <div className="text-center">Task Title</div>
            <div className="text-center">Status</div>
          </div>

          {selectedUserTasks.length === 0 ? (
            <div className="px-6 py-10 text-sm text-gray-600 text-center">
              No tasks for selected user.
            </div>
          ) : (
            selectedUserTasks.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-2 border-t border-gray-300 px-6 py-4 text-sm text-gray-800"
              >
                <div className="text-center truncate">{t.title}</div>
                <div className="flex justify-center">
                  <span className="rounded-md bg-[#244a9b] px-8 py-1.5 text-xs font-semibold text-white">
                    {t.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 flex items-center justify-center gap-3 text-xs text-gray-700">
        <div className="relative h-6 w-6">
          <Image
            src="/logo.png"
            alt="Task Manager logo"
            fill
            className="object-contain"
          />
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
    <div className="w-52 overflow-hidden rounded-md bg-white shadow-sm">
      <div className="bg-[#6f8394] py-2 text-center text-xs font-semibold text-black">
        {title}
      </div>
      <div className="py-6 text-center text-sm text-black">{value}</div>
    </div>
  );
}
