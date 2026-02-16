"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type TaskRow = {
  id: string;
  title: string;
};

type NotificationRow = {
  id: string;
  user_id: string;
  task_id: string | null;
  message: string | null;
  type: string | null;
  is_read: boolean;
  created_at: string | null;
};

function formatDateTime(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(); // you can change format later
}

export default function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("User");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);

  // filter UI
  const [selectedTaskId, setSelectedTaskId] = useState<string>(""); // exact task filter
  const [searchTitle, setSearchTitle] = useState<string>(""); // search by task title keyword

  // applied filters (only when click Filter)
  const [appliedTaskId, setAppliedTaskId] = useState<string>("");
  const [appliedSearchTitle, setAppliedSearchTitle] = useState<string>("");

  // init
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data } = await supabase.auth.getSession();
      const session = data.session;

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

      await Promise.all([loadTasks(user.id), loadNotifications(user.id)]);

      if (mounted) setLoading(false);
    };

    init();

    return () => {
      mounted = false;
    };
  }, [router]);

  const loadTasks = async (uid: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("id,title")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setTasks([]);
      return;
    }

    setTasks((data as TaskRow[]) || []);
  };

  const loadNotifications = async (uid: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("id,user_id,task_id,message,type,is_read,created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setNotifications([]);
      return;
    }

    setNotifications((data as NotificationRow[]) || []);
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  // helper: map task_id -> title
  const taskTitleMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of tasks) m.set(t.id, t.title);
    return m;
  }, [tasks]);

  // filtered list
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Must be tied to a task (you said: search specific task, not "info")
      if (!n.task_id) return false;

      // exact task filter
      if (appliedTaskId && n.task_id !== appliedTaskId) return false;

      // title keyword search
      if (appliedSearchTitle.trim()) {
        const title = taskTitleMap.get(n.task_id) || "";
        if (!title.toLowerCase().includes(appliedSearchTitle.trim().toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [notifications, appliedTaskId, appliedSearchTitle, taskTitleMap]);

  const go = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    router.push("/login");
    router.refresh();
  };

  const handleApplyFilter = () => {
    setAppliedTaskId(selectedTaskId);
    setAppliedSearchTitle(searchTitle);
  };

  const handleClearFilter = () => {
    setSelectedTaskId("");
    setSearchTitle("");
    setAppliedTaskId("");
    setAppliedSearchTitle("");
  };

  const markAsRead = async (notifId: string) => {
    if (!userId) return;
    setErrorMsg("");

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notifId)
      .eq("user_id", userId);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    await loadNotifications(userId);
  };

  const deleteNotification = async (notifId: string) => {
    if (!userId) return;
    const ok = confirm("Delete this notification?");
    if (!ok) return;

    setErrorMsg("");

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notifId)
      .eq("user_id", userId);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    await loadNotifications(userId);
  };

  const viewTask = (taskId: string) => {
    // IMPORTANT: your folder is task-detail/[id]
    router.push(`/task-detail/${taskId}`);
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Top bar */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 hover:bg-white"
              aria-label="Open menu"
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
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <h1 className="text-5xl font-extrabold text-black">Notifications</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-black">
            Unread: <span className="text-red-600">{unreadCount}</span>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full bg-[#244a9b] px-8 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Logout
          </button>
        </div>
      </div>

      {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}
      {loading && <p className="mt-4 text-sm text-gray-600">Loading...</p>}

      <h2 className="mt-10 text-3xl font-extrabold text-black">Notifications:</h2>

      {/* Filter row */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-black">Task:</span>

        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          className="w-96 rounded-md bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="">Select a task...</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        <input
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Or search by task title keyword…"
          className="w-72 rounded-md bg-white px-3 py-2 text-sm outline-none"
        />

        <button
          onClick={handleApplyFilter}
          className="rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm"
        >
          Filter
        </button>

        <button
          onClick={handleClearFilter}
          className="rounded-md bg-white px-6 py-2 text-sm font-semibold text-gray-600 shadow-sm"
        >
          Clear
        </button>
      </div>

      {/* List */}
      <div className="mt-6 overflow-hidden rounded-lg border border-black/30 bg-white">
        {!loading && filteredNotifications.length === 0 ? (
          <div className="px-6 py-10 text-sm text-gray-600">
            No notifications for this task.
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const title = n.task_id ? taskTitleMap.get(n.task_id) : "";
            return (
              <div
                key={n.id}
                className="flex items-center justify-between border-b border-black/10 px-6 py-5 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <input type="radio" checked={!n.is_read} readOnly className="mt-1" />
                  <div>
                    <div className="text-sm font-semibold text-black">
                      {title ? `${title} — ` : ""}
                      <span className="font-normal">{n.message ?? ""}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDateTime(n.created_at)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="rounded-full bg-[#244a9b] px-6 py-2 text-xs font-semibold text-white hover:opacity-95"
                  >
                    Mark as read
                  </button>
                  <button
                    onClick={() => n.task_id && viewTask(n.task_id)}
                    className="rounded-full bg-[#244a9b] px-6 py-2 text-xs font-semibold text-white hover:opacity-95"
                  >
                    View Task
                  </button>
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="rounded-full bg-red-600 px-6 py-2 text-xs font-semibold text-white hover:opacity-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
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
