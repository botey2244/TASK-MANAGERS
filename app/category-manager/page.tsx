"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Category = { id: string; name: string };

export default function CategoryManagerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // UI-only notification count
  const [notifCount] = useState(2);

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Work" },
    { id: "2", name: "Home" },
    { id: "3", name: "School" },
    { id: "4", name: "Project" },
    { id: "5", name: "Assignment" },
    { id: "6", name: "Shop" },
  ]);

  const [selected, setSelected] = useState<string>("");
  const [filterApplied, setFilterApplied] = useState<string>("");

  const filtered = useMemo(() => {
    if (!filterApplied) return categories;
    return categories.filter((c) => c.name === filterApplied);
  }, [categories, filterApplied]);

  const go = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  const handleAdd = () => {
    const name = prompt("Enter new category name:");
    if (!name) return;
    const clean = name.trim();
    if (!clean) return;

    const exists = categories.some((c) => c.name.toLowerCase() === clean.toLowerCase());
    if (exists) return alert("This category already exists.");

    setCategories((prev) => [...prev, { id: crypto.randomUUID(), name: clean }]);
  };

  const handleEdit = (id: string) => {
    const current = categories.find((c) => c.id === id);
    if (!current) return;
    const name = prompt("Edit category name:", current.name);
    if (!name) return;
    const clean = name.trim();
    if (!clean) return;

    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: clean } : c)));
  };

  const handleDelete = (id: string) => {
    const current = categories.find((c) => c.id === id);
    if (!current) return;
    if (!confirm(`Delete category "${current.name}"?`)) return;

    setCategories((prev) => prev.filter((c) => c.id !== id));
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

          {/* Icon (4 squares + circle like your UI) */}
          <div className="relative h-12 w-12">
            <div className="absolute left-0 top-0 h-5 w-5 rounded bg-[#2b3a67]" />
            <div className="absolute right-0 top-0 h-5 w-5 rounded bg-[#2b3a67]" />
            <div className="absolute left-0 bottom-0 h-5 w-5 rounded bg-[#2b3a67]" />
            <div className="absolute right-0 bottom-0 h-5 w-5 rounded bg-[#2b3a67]" />
            <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2b3a67] bg-white" />
          </div>

          <h1 className="text-5xl font-extrabold text-black">Category Manager</h1>
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

      {/* Add Category */}
      <div className="mt-6">
        <button
          onClick={handleAdd}
          className="rounded-md bg-[#6f8394] px-8 py-2 text-sm font-semibold text-black/90 hover:opacity-95"
        >
          + Add Category
        </button>
      </div>

      <h2 className="mt-8 text-3xl font-extrabold text-black">Categories:</h2>

      {/* Filter row */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-medium text-black">Category:</span>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-64 rounded-md bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="">Work/Home/Shop...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setFilterApplied(selected)}
          className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm"
        >
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-sm border border-black/50 bg-white">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between border-b border-black/40 px-6 py-4 last:border-b-0"
          >
            <span className="text-sm text-black">{c.name}</span>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(c.id)}
                className="rounded-full bg-[#244a9b] px-5 py-1 text-xs font-semibold text-white hover:opacity-95"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="rounded-full bg-[#244a9b] px-5 py-1 text-xs font-semibold text-white hover:opacity-95"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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
