"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type TaskStatus = "Pending" | "In Progress" | "Completed" | "Missing";

type TaskRow = {
  id: string;
  user_id: string;
  title: string;
  status: TaskStatus;
  category: string | null;
  created_at?: string;
};

export default function CategoryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // ✅ Protect page (must be logged in)
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

      await loadMyTasks(me.id);
      setLoading(false);
    };

    init();
  }, [router]);

  // ✅ Load ONLY tasks of current user
  const loadMyTasks = async (uid: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("id,user_id,title,status,category,created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setTasks([]);
      return;
    }

    setTasks((data as TaskRow[]) || []);
  };

  // ✅ Collect all categories from tasks (unique list)
  const categoryList = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      const c = (t.category ?? "").trim();
      if (c) set.add(c);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [tasks]);

  // ✅ Filter tasks by selected/search category
  const filteredTasks = useMemo(() => {
    const q = (selectedCategory || searchCategory).trim().toLowerCase();
    if (!q) return [];

    return tasks.filter((t) => (t.category ?? "").trim().toLowerCase() === q);
  }, [tasks, searchCategory, selectedCategory]);

  // ✅ Counts
  const stats = useMemo(() => {
    const total = filteredTasks.length;
    let pending = 0,
      inProgress = 0,
      completed = 0,
      missing = 0;

    for (const t of filteredTasks) {
      if (t.status === "Pending") pending++;
      else if (t.status === "In Progress") inProgress++;
      else if (t.status === "Completed") completed++;
      else if (t.status === "Missing") missing++;
    }

    return { total, pending, inProgress, completed, missing };
  }, [filteredTasks]);

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h1 className="text-5xl font-extrabold text-black">Category</h1>

        <button
          onClick={() => router.push("/user-dashboard")}
          className="rounded-full bg-[#244a9b] px-7 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Back
        </button>
      </div>

      {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}
      {loading && <p className="mt-4 text-sm text-gray-700">Loading...</p>}

      {/* Search + Dropdown */}
      <div className="mt-8 flex flex-wrap items-center gap-6">
        {/* Search category input */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-black">Search category:</span>
          <input
            value={searchCategory}
            onChange={(e) => {
              setSearchCategory(e.target.value);
              setSelectedCategory(""); // clear dropdown if typing
            }}
            placeholder="Example: school"
            className="w-80 rounded-md bg-white px-3 py-2 text-sm outline-none"
          />
        </div>

        {/* Dropdown categories */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-black">Categories:</span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSearchCategory(""); // clear input if selecting
            }}
            className="w-80 rounded-md bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="">Select category</option>
            {categoryList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mt-10 flex flex-wrap gap-6">
        <StatCard title="Total Tasks" value={stats.total} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="In Progress" value={stats.inProgress} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Missing" value={stats.missing} />
      </div>

      {/* Tasks Table */}
      <div className="mt-10 overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="grid grid-cols-3 bg-[#5f788b] px-6 py-3 text-sm font-semibold text-black">
          <div className="text-center">Task Title</div>
          <div className="text-center">Category</div>
          <div className="text-center">Status</div>
        </div>

        {!selectedCategory && !searchCategory ? (
          <div className="px-6 py-10 text-center text-sm text-gray-600">
            Type a category (example: <b>school</b>) or select one from dropdown.
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-600">
            No tasks found for this category.
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-3 border-t border-gray-300 px-6 py-4 text-sm text-gray-800"
            >
              <div className="truncate text-center">{t.title}</div>
              <div className="truncate text-center">{t.category ?? "-"}</div>
              <div className="flex justify-center">
                <span className="rounded-md bg-[#244a9b] px-6 py-1.5 text-xs font-semibold text-white">
                  {t.status}
                </span>
              </div>
            </div>
          ))
        )}
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
