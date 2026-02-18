"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type TaskStatus = "Pending" | "In Progress" | "Completed" | "Missing";
type TaskPriority = "High" | "Medium" | "Low";

type TaskRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null; // YYYY-MM-DD
  created_at?: string;
};

function formatDate(iso: string | null) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  // user
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState<string | null>(null);

  // data
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [tasks, setTasks] = useState<TaskRow[]>([]);

  // notifications count (real from DB)
  const [notifCount, setNotifCount] = useState(0);

  // filter UI (select values)
  const [filterStatus, setFilterStatus] = useState<"" | TaskStatus>("");
  const [filterPriority, setFilterPriority] = useState<"" | TaskPriority>("");

  // only apply when clicking Filter
  const [appliedStatus, setAppliedStatus] = useState<"" | TaskStatus>("");
  const [appliedPriority, setAppliedPriority] = useState<"" | TaskPriority>("");

  // ---------------------------
  // Init: protect + load user + load tasks + load notif count
  // ---------------------------
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) {
        if (!mounted) return;
        setErrorMsg(sessionErr.message);
        setLoading(false);
        return;
      }

      const session = sessionData.session;
      if (!session) {
        router.push("/login");
        return;
      }

      const user = session.user;
      if (!mounted) return;

      setUserId(user.id);

      const fullName =
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        user.email ||
        "User";

      setUserName(fullName);

      await Promise.all([loadTasks(user.id), loadNotifCount(user.id)]);

      if (mounted) setLoading(false);
    };

    init();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // ---------------------------
  // Load tasks
  // ---------------------------
  const loadTasks = async (uid: string) => {
    setErrorMsg("");

    const { data, error } = await supabase
      .from("tasks")
      .select("id,user_id,title,description,category,priority,status,due_date,created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      setTasks([]);
      setErrorMsg(error.message);
      return;
    }

    setTasks((data as TaskRow[]) || []);
  };

  // ---------------------------
  // Load unread notifications count
  // ---------------------------
  const loadNotifCount = async (uid: string) => {
    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid)
      .eq("is_read", false);

    if (!error) setNotifCount(count ?? 0);
  };

  // ---------------------------
  // Stats
  // ---------------------------
  const counts = useMemo(() => {
    const c: Record<TaskStatus, number> = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
      Missing: 0,
    };
    for (const t of tasks) c[t.status]++;
    return c;
  }, [tasks]);

  // ---------------------------
  // Filtered tasks
  // ---------------------------
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const okStatus = appliedStatus ? t.status === appliedStatus : true;
      const okPri = appliedPriority ? t.priority === appliedPriority : true;
      return okStatus && okPri;
    });
  }, [tasks, appliedStatus, appliedPriority]);

  // ---------------------------
  // Navigation helpers
  // ---------------------------
  const go = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  // ---------------------------
  // Logout
  // ---------------------------
  const handleLogout = async () => {
    setErrorMsg("");
    const { error } = await supabase.auth.signOut();
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    router.push("/login");
    router.refresh();
  };

  // ---------------------------
  // Delete Task (works best if FK is ON DELETE CASCADE)
  // ---------------------------
const handleDelete = async (taskId: string) => {
  const ok = confirm("Delete this task?");
  if (!ok) return;
  if (!userId) return;

  setErrorMsg("");

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) {
    setErrorMsg(error.message);
    return;
  }

  await loadTasks(userId);
  router.refresh();
};

  // ---------------------------
  // Filters
  // ---------------------------
  const handleApplyFilter = () => {
    setAppliedStatus(filterStatus);
    setAppliedPriority(filterPriority);
  };

  const handleClearFilter = () => {
    setFilterStatus("");
    setFilterPriority("");
    setAppliedStatus("");
    setAppliedPriority("");
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 hover:bg-white"
              aria-label="Open menu"
              type="button"
            >
              ☰
            </button>

            {menuOpen && (
              <div className="absolute left-0 mt-3 w-72 overflow-hidden rounded-xl bg-white shadow-lg">
                <div className="border-b px-4 py-3">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                </div>

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

                <div className="border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-black">User Dashboard</h1>
            <p className="mt-1 text-sm text-gray-700">
              Hello, <span className="font-semibold">{userName}</span>
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/notifications")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/70 hover:bg-white"
            aria-label="Notifications"
            type="button"
          >
            🔔
            {notifCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {notifCount}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="rounded-full bg-[#244a9b] px-8 py-2 text-sm font-semibold text-white hover:opacity-95"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>

      {/* messages */}
      {errorMsg && <p className="mt-6 text-sm text-red-600">{errorMsg}</p>}
      {loading && <p className="mt-6 text-sm text-gray-600">Loading...</p>}

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
          type="button"
        >
          + Add task
        </button>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-black">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-56 rounded-md bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="">All</option>
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
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button
          onClick={handleApplyFilter}
          className="rounded-md bg-white px-10 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:opacity-90"
          type="button"
        >
          Filter
        </button>

        <button
          onClick={handleClearFilter}
          className="rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:opacity-90"
          type="button"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-hidden rounded-lg">
        <div className="grid grid-cols-6 bg-[#5f788b] px-6 py-3 text-sm font-semibold text-black">
          <div>Title</div>
          <div className="text-center">Category</div>
          <div className="text-center">Priority</div>
          <div className="text-center">Due Date</div>
          <div className="text-center">Status</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="bg-white">
          {!loading && filteredTasks.length === 0 ? (
            <div className="px-6 py-10 text-sm text-gray-600">
              No tasks yet. Click <span className="font-semibold">+ Add task</span>.
            </div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-6 border-t border-gray-300 px-6 py-4 text-sm text-gray-800"
              >
                <div className="truncate">{t.title}</div>
                <div className="text-center truncate">{t.category ?? "-"}</div>
                <div className="text-center">{t.priority}</div>
                <div className="text-center">{formatDate(t.due_date)}</div>
                <div className="text-center">{t.status}</div>

                <div className="text-center">
                  <button
                    className="font-medium text-gray-700 hover:underline"
                    onClick={() => router.push(`/add-task?id=${t.id}`)}
                    type="button"
                  >
                    Edit
                  </button>
                  <span className="mx-2 text-gray-400">/</span>
                  <button
                    className="font-medium text-red-600 hover:underline"
                    onClick={() => handleDelete(t.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
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
      type="button"
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
