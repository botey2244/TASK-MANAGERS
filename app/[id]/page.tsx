"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dueDate: string;
  createdDate: string;
};

export default function TaskDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id ?? "");

  // UI demo tasks (later replace with database)
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "New Assignment - Database",
      description: "Complete the project assignment document",
      category: "Work/Personal",
      priority: "High",
      status: "Pending",
      dueDate: "Jan 12, 2026",
      createdDate: "Apr 12, 2025",
    },
    {
      id: "2",
      title: "Task status updated - Project Work",
      description: "Update project progress and submit report",
      category: "Project",
      priority: "Medium",
      status: "In Progress",
      dueDate: "Feb 01, 2026",
      createdDate: "Apr 10, 2025",
    },
    {
      id: "3",
      title: "New task created - Research Paper",
      description: "Write introduction and problem statement",
      category: "Research",
      priority: "High",
      status: "Pending",
      dueDate: "Mar 05, 2026",
      createdDate: "Apr 09, 2025",
    },
    {
      id: "4",
      title: "New Assignment - Database",
      description: "Complete the project assignment document",
      category: "Assignment",
      priority: "High",
      status: "Pending",
      dueDate: "Jan 12, 2026",
      createdDate: "Apr 12, 2025",
    },
    {
      id: "5",
      title: "New Assignment - Data Structure",
      description: "Finish linked list exercises",
      category: "Assignment",
      priority: "Medium",
      status: "Pending",
      dueDate: "Jan 20, 2026",
      createdDate: "Apr 11, 2025",
    },
  ]);

  const currentTask = useMemo(() => {
    return tasks.find((t) => t.id === id) ?? tasks[0];
  }, [tasks, id]);

  const [selectedId, setSelectedId] = useState(currentTask.id);
  const [appliedId, setAppliedId] = useState(currentTask.id);

  const appliedTask = useMemo(() => {
    return tasks.find((t) => t.id === appliedId) ?? currentTask;
  }, [tasks, appliedId, currentTask]);

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Top row */}
      <div className="flex items-start justify-between">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-black hover:opacity-80"
        >
          <span className="text-xl">←</span> Back
        </button>

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-black">Task Details</h1>

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="rounded-md bg-[#244a9b] px-6 py-2 text-xs font-semibold text-white hover:opacity-95">
            Delete Task
          </button>
          <button className="rounded-md bg-[#244a9b] px-6 py-2 text-xs font-semibold text-white hover:opacity-95">
            Edit Task
          </button>
          <button className="rounded-md bg-[#244a9b] px-6 py-2 text-xs font-semibold text-white hover:opacity-95">
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
          className="w-72 rounded-md bg-white px-3 py-2 text-sm outline-none"
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
            router.push(`/task-details/${selectedId}`);
          }}
          className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm"
        >
          Filter
        </button>
      </div>

      {/* Task title */}
      <h2 className="mt-10 text-4xl font-extrabold text-black">{appliedTask.title}</h2>

      {/* Details table */}
      <div className="mt-8 overflow-hidden rounded-sm border border-black/50 bg-white">
        <Row label="Description" value={appliedTask.description} />
        <Row label="Category" value={appliedTask.category} />
        <Row label="Priority" value={appliedTask.priority} />
        <Row label="Status" value={appliedTask.status} />
        <Row label="Due Date" value={appliedTask.dueDate} />
        <Row label="Created Date" value={appliedTask.createdDate} />
      </div>

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
