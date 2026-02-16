"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
};

export default function AddTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id"); // if exists -> edit mode
  const isEdit = useMemo(() => Boolean(taskId), [taskId]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [dueDate, setDueDate] = useState<string>(""); // YYYY-MM-DD

  // protect + if edit -> load task
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setPageLoading(true);
      setErrorMsg("");

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        if (!mounted) return;
        setErrorMsg(sessionError.message);
        setPageLoading(false);
        return;
      }

      const user = sessionData.session?.user;
      if (!user) {
        router.push("/login");
        return;
      }

      // create mode
      if (!taskId) {
        if (mounted) setPageLoading(false);
        return;
      }

      // edit mode (only load your own task)
      const { data, error } = await supabase
        .from("tasks")
        .select("id,user_id,title,description,category,priority,status,due_date")
        .eq("id", taskId)
        .eq("user_id", user.id)
        .single();

      if (!mounted) return;

      if (error) {
        setErrorMsg(error.message);
      } else {
        const t = data as TaskRow;
        setTitle(t.title ?? "");
        setDescription(t.description ?? "");
        setCategory(t.category ?? "");
        setPriority((t.priority as TaskPriority) ?? "Medium");
        setStatus((t.status as TaskStatus) ?? "Pending");
        setDueDate(t.due_date ?? "");
      }

      setPageLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [router, taskId]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    router.push("/login");
    router.refresh();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }

    setLoading(true);

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setLoading(false);
      setErrorMsg(sessionError.message);
      return;
    }

    const user = sessionData.session?.user;
    if (!user) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      category: category.trim() ? category.trim() : null,
      priority,
      status,
      due_date: dueDate ? dueDate : null,
    };

    // ✅ UPDATE (edit)
    if (isEdit && taskId) {
      const { error: updateErr } = await supabase
        .from("tasks")
        .update(payload)
        .eq("id", taskId)
        .eq("user_id", user.id);

      if (updateErr) {
        setLoading(false);
        setErrorMsg(updateErr.message);
        return;
      }

      // ✅ Create notification (taskId already exists -> no FK error)
      // If you are using SQL trigger Option B, you can DELETE this block.
      const { error: notiErr } = await supabase.from("notifications").insert({
        user_id: user.id,
        task_id: taskId,
        message: `Task updated: ${payload.title}`,
        type: "info",
        is_read: false,
      });

      if (notiErr) {
        // don't block saving; show only if you want
        console.log("Notification insert error:", notiErr.message);
      }

      setLoading(false);
      router.push("/user-dashboard");
      router.refresh();
      return;
    }

    // ✅ INSERT (create) + RETURN new task id
    const { data: newTask, error: insertErr } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        ...payload,
      })
      .select("id")
      .single();

    if (insertErr) {
      setLoading(false);
      setErrorMsg(insertErr.message);
      return;
    }

    // ✅ Create notification using the REAL new task id (prevents FK error)
    // If you are using SQL trigger Option B, you can DELETE this block.
    const { error: notiErr } = await supabase.from("notifications").insert({
      user_id: user.id,
      task_id: newTask.id,
      message: `New task created: ${payload.title}`,
      type: "info",
      is_read: false,
    });

    if (notiErr) {
      console.log("Notification insert error:", notiErr.message);
    }

    setLoading(false);
    router.push("/user-dashboard");
    router.refresh();
  };

  const handleCancel = () => {
    router.push("/user-dashboard");
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70">
            <span className="text-xl">📋</span>
          </div>
          <h1 className="text-4xl font-extrabold text-black">
            {isEdit ? "Edit Task" : "Add Task"}
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-full bg-[#244a9b] px-8 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Logout
        </button>
      </div>

      {pageLoading ? (
        <div className="mt-10 text-sm text-gray-600">Loading...</div>
      ) : (
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-2xl rounded-3xl bg-[#f7eeee] p-10 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black">Title:</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black">
                  Description:
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black">
                    Category:
                  </label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter category"
                    className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black">
                    Priority:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Due Date + Status */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black">
                    Due Date:
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black">
                    Status:
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full rounded-md bg-[#dcdcdc] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Missing">Missing</option>
                  </select>
                </div>
              </div>

              {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

              {/* Buttons */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-[#244a9b] px-10 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-full bg-[#244a9b] px-10 py-2.5 text-sm font-semibold text-white hover:opacity-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
