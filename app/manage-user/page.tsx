"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  status: string | null;
};

export default function ManageUserPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const uid = sp.get("uid"); // ✅ from admin-dashboard manage button

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [role, setRole] = useState("user");
  const [status, setStatus] = useState("active");

  // ✅ protect + load selected user
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

      const myEmail = (me.email ?? "").toLowerCase();
      if (!myEmail.endsWith("@admin.com")) {
        router.push("/user-dashboard");
        return;
      }

      if (!uid) {
        setErrorMsg("User id is required (open from Manage button).");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id,email,full_name,role,status")
        .eq("id", uid)
        .single();

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      const u = data as UserRow;
      setUserId(u.id);
      setFullName(u.full_name ?? "");
      setEmail(u.email ?? "");
      setRole(u.role ?? "user");
      setStatus(u.status ?? "active");

      setLoading(false);
    };

    init();
  }, [router, uid]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setErrorMsg("User id is required.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName.trim(),
        role,
        status,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/admin-dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#cfe0f2] px-10 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin-dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-black hover:opacity-80"
        >
          <span className="text-xl">←</span> Manage User
        </button>

        <button
          onClick={handleLogout}
          className="rounded-full bg-[#244a9b] px-8 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Logout
        </button>
      </div>

      {/* Title */}
      <div className="mt-8 flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black">
          {/* nicer icon */}
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
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
            <path
              d="M19.5 7.5l.7-1.3 1.5.2-.9 1.3.9 1.3-1.5.2-.7-1.3-1.5.2.9-1.3-.9-1.3 1.5-.2Z"
              fill="#fff"
              opacity="0.95"
            />
          </svg>
        </div>

        <h1 className="mt-4 text-4xl font-extrabold text-black">User info</h1>
        <p className="mt-1 text-xs text-gray-700">
          Open from Admin Dashboard → Manage
        </p>
      </div>

      {loading ? (
        <div className="mt-10 text-sm text-gray-700 text-center">Loading...</div>
      ) : (
        <form onSubmit={onSave} className="mx-auto mt-8 w-full max-w-2xl">
          <div className="rounded-2xl bg-[#fff6f6] px-12 py-10 shadow-sm">
            {/* User id */}
            <label className="block text-sm font-semibold text-black">
              User_Id:
            </label>
            <input
              value={userId}
              readOnly
              className="mt-2 w-full rounded-md bg-[#e7e7e7] px-4 py-3 text-sm outline-none"
            />

            {/* Full name */}
            <label className="mt-6 block text-sm font-semibold text-black">
              Full Name:
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="mt-2 w-full rounded-md bg-[#e7e7e7] px-4 py-3 text-sm outline-none"
            />

            {/* Email */}
            <label className="mt-6 block text-sm font-semibold text-black">
              Email:
            </label>
            <input
              value={email}
              readOnly
              className="mt-2 w-full rounded-md bg-[#e7e7e7] px-4 py-3 text-sm outline-none"
            />

            {/* Role + Status */}
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-black">
                  Role:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 w-full rounded-md bg-[#e7e7e7] px-4 py-3 text-sm outline-none"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black">
                  Status:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 w-full rounded-md bg-[#e7e7e7] px-4 py-3 text-sm outline-none"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
            </div>

            {errorMsg && <p className="mt-6 text-sm text-red-600">{errorMsg}</p>}

            {/* Buttons */}
            <div className="mt-8 flex justify-center gap-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#244a9b] px-10 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin-dashboard")}
                className="rounded-full bg-[#244a9b] px-10 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Footer */}
      <div className="mt-12 flex items-center justify-center gap-3 text-xs text-gray-700">
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
