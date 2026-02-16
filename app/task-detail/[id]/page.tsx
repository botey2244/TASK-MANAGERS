"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type TaskRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  created_at: string;
};

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id ?? "");

  const [userLabel, setUserLabel] = useState("User");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [task, setTask] = useState<TaskRow | null>(null);

  const [selectedId, setSelectedId] = useState(id);
  const [appliedId, setAppliedId] = useState(id);

  // ✅ protect + load tasks + load current task
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        router.push("/login");
        return;
      }

      const user = session.user;
      const label =
        (user.user_metadata?.full_name as string) ||
        (user.user_metadata?.name as string) ||
        user.email ||
        "User";

      if (mounted) setUserLabel(label);

      // load all tasks for dropdown
      const { data: allTasks, error: allErr } = await supabase
        .from("tasks")
        .select("id,user_id,title,description,category,priority,status,due_date,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (allErr) {
        setErrorMsg(allErr.message);
        setLoading(false);
        return;
      }

      const list = (allTasks as TaskRow[]) ?? [];
      setTasks(list);

      const targetId = appliedId || id;
      const found = list.find((t) => t.id === targetId) ?? null;

      if (!found) {
        setErrorMsg("Task not found.");
        setTask(null);
      } else {
        setTask(found);
        setSelectedId(found.id);
      }

      setLoading(false);
    };

    run();

    return () => {
      mounted = false;
    };
  }, [router, id, appliedId]);

  const currentTask = useMemo(() => task, [task]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!currentTask) return;
    if (!confirm(`Delete task "${currentTask.title}"?`)) return;

    const { error } = await supabase.from("tasks").delete().eq("id", currentTask.id);
    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/user-dashboard");
    router.refresh();
  };

  const handleEdit = () => {
    if (!currentTask) return;
    // You already use add-task page for edit mode: ?id=
    router.push(`/add-task?id=${currentTask.id}`);
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "-";
    // if due_date is YYYY-MM-DD it is ok
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-black hover:opacity-80"
        >
          <span className="text-xl">←</span> Back
        </button>

        <h1 className="text-5xl font-extrabold text-black">Task Details</h1>

        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-black">👤 {userLabel}</div>

          <button
            onClick={handleDelete}
            className="rounded-md bg-[#244a9b] px-6 py-2 text-xs font-semibold text-white hover:opacity-95"
          >
            Delete Task
          </button>
          <button
            onClick={handleEdit}
            className="rounded-md bg-[#244a9b] px-6 py-2 text-xs font-semibold text-white hover:opacity-95"
          >
            Edit Task
          </button>
          <button
            onClick={handleLogout}
            className="rounded-md bg-[#244a9b] px-6 py-2 text-xs font-semibold text-white hover:opacity-95"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="mt-10 flex items-center gap-4">
        <span className="text-sm font-medium text-black">Tasks:</span>

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-96 rounded-md bg-white px-3 py-2 text-sm outline-none"
        >
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setAppliedId(selectedId);
            router.push(`/task-detail/${selectedId}`); // ✅ correct path
          }}
          className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm"
        >
          Filter
        </button>
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-gray-700">Loading...</p>
      ) : (
        <>
          {errorMsg && <p className="mt-6 text-sm text-red-600">{errorMsg}</p>}

          {currentTask && (
            <>
              <h2 className="mt-10 text-4xl font-extrabold text-black">{currentTask.title}</h2>

              <div className="mt-8 overflow-hidden rounded-sm border border-black/50 bg-white">
                <Row label="Description" value={currentTask.description ?? "-"} />
                <Row label="Category" value={currentTask.category ?? "-"} />
                <Row label="Priority" value={currentTask.priority ?? "-"} />
                <Row label="Status" value={currentTask.status ?? "-"} />
                <Row label="Due Date" value={formatDate(currentTask.due_date)} />
                <Row label="Created Date" value={formatDate(currentTask.created_at)} />
              </div>
            </>
          )}
        </>
      )}

      {/* Bottom note */}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-black/40 px-6 py-6 last:border-b-0">
      <span className="text-sm text-black">
        {label}: {value}
      </span>
    </div>
  );
}
