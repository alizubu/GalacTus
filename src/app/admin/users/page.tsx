"use client";

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, X, Check, AlertCircle,
  Shield, User as UserIcon, ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

// All available permission keys + human labels
const PERMISSION_DEFS = [
  { key: "hero",       label: "Hero Section" },
  { key: "about",      label: "About / Bio" },
  { key: "experience", label: "Work Experience" },
  { key: "education",  label: "Education" },
  { key: "skills",     label: "Skills" },
  { key: "projects",   label: "Case Studies" },
  { key: "gallery",    label: "Gallery" },
  { key: "navbar",     label: "Navbar Editor" },
  { key: "messages",   label: "Messages" },
  { key: "contact",    label: "Contact Info" },
  { key: "settings",   label: "Settings" },
];

interface AdminUser {
  id: string; email: string; name: string; avatarUrl: string;
  role: "master" | "user"; permissions: string[]; active: boolean; createdAt: string;
}

const emptyForm = {
  name: "", email: "", password: "", role: "user" as "master" | "user",
  permissions: [] as string[], active: true,
};

function PermissionGrid({ permissions, onChange, disabled }: {
  permissions: string[];
  onChange: (p: string[]) => void;
  disabled?: boolean;
}) {
  const toggle = (key: string) => {
    onChange(permissions.includes(key) ? permissions.filter((p) => p !== key) : [...permissions, key]);
  };
  const allSelected = PERMISSION_DEFS.every((d) => permissions.includes(d.key));
  const toggleAll = () => onChange(allSelected ? [] : PERMISSION_DEFS.map((d) => d.key));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Permissions
        </label>
        {!disabled && (
          <button type="button" onClick={toggleAll}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PERMISSION_DEFS.map((def) => {
          const checked = permissions.includes(def.key);
          return (
            <label
              key={def.key}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all duration-150 text-sm
                ${checked
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => !disabled && toggle(def.key)}
                className="accent-indigo-600 w-3.5 h-3.5 shrink-0"
                disabled={disabled}
              />
              <span className="text-[12px] font-medium leading-tight">{def.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function UsersAdminPage() {
  const [users, setUsers]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState<"add" | "edit" | null>(null);
  const [saving, setSaving] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [form, setForm]     = useState({ ...emptyForm });
  const [formError, setFormError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ ...emptyForm });
    setFormError("");
    setEditTarget(null);
    setModal("add");
  };

  const openEdit = (u: AdminUser) => {
    setForm({ name: u.name, email: u.email, password: "", role: u.role, permissions: [...u.permissions], active: u.active });
    setFormError("");
    setEditTarget(u);
    setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditTarget(null); setFormError(""); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Name and email are required.");
      return;
    }
    if (modal === "add" && !form.password) {
      setFormError("Password is required for new users.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const body: Record<string, unknown> = {
        name: form.name, email: form.email, role: form.role,
        permissions: form.role === "master" ? [] : form.permissions,
        active: form.active,
      };
      if (form.password) body.password = form.password;

      const url = modal === "add" ? "/api/admin/users" : `/api/admin/users/${editTarget!.id}`;
      const method = modal === "add" ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? "Save failed."); return; }
      toast.success(modal === "add" ? "User created." : "User updated.");
      closeModal();
      load();
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`Delete user "${u.name}" (${u.email})? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Delete failed."); return; }
      toast.success("User deleted.");
      load();
    } catch { toast.error("Network error."); }
  };

  const toggleActive = async (u: AdminUser) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !u.active }),
      });
      if (!res.ok) { toast.error("Failed to update status."); return; }
      toast.success(u.active ? "User suspended." : "User reactivated.");
      load();
    } catch { toast.error("Network error."); }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            {users.length} user{users.length !== 1 ? "s" : ""} · Only master accounts can manage users
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
          <Plus size={15} /> Add User
        </button>
      </div>

      {/* User list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-400 text-sm">
          No users yet. Add one above.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id}
              className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-opacity ${!u.active ? "opacity-60" : ""} ${u.role === "master" ? "border-indigo-100" : "border-gray-100"}`}>
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                style={{ background: u.role === "master" ? "#eef2ff" : "#f3f4f6" }}>
                {u.avatarUrl
                  ? <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                  : <span className="text-xs font-bold" style={{ color: u.role === "master" ? "#6366f1" : "#6b7280" }}>
                      {u.name.slice(0,2).toUpperCase()}
                    </span>}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 text-sm truncate">{u.name}</p>
                  {u.role === "master"
                    ? <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700"><ShieldCheck size={10} />Master</span>
                    : <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"><UserIcon size={10} />User</span>}
                  {!u.active && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Suspended</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{u.email}</p>
                {u.role === "user" && u.permissions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {u.permissions.slice(0,4).map((p) => (
                      <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">{p}</span>
                    ))}
                    {u.permissions.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">+{u.permissions.length - 4}</span>
                    )}
                    {u.permissions.length === 0 && (
                      <span className="text-[10px] text-gray-400 italic">No access</span>
                    )}
                  </div>
                )}
                {u.role === "master" && (
                  <p className="text-[10px] text-indigo-400 mt-0.5">Full access to everything</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleActive(u)}
                  title={u.active ? "Suspend" : "Reactivate"}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-amber-500 transition-colors">
                  <Shield size={14} />
                </button>
                <button onClick={() => openEdit(u)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(u)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">{modal === "add" ? "Add User" : `Edit — ${editTarget?.name}`}</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Basic fields */}
              {[
                { key: "name",  label: "Display Name", type: "text",     placeholder: "John Doe" },
                { key: "email", label: "Email Address", type: "email",    placeholder: "john@example.com" },
                { key: "password", label: modal === "add" ? "Password" : "New Password (leave blank to keep)", type: "password", placeholder: "Min. 8 characters" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={(form as Record<string, unknown>)[f.key] as string ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                  />
                </div>
              ))}

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                <div className="flex gap-2">
                  {(["user", "master"] as const).map((r) => (
                    <button key={r} type="button"
                      onClick={() => setForm((p) => ({ ...p, role: r }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        form.role === r
                          ? r === "master" ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-gray-400 bg-gray-100 text-gray-800"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}>
                      {r === "master" ? <ShieldCheck size={14} /> : <UserIcon size={14} />}
                      {r === "master" ? "Master" : "User"}
                    </button>
                  ))}
                </div>
                {form.role === "master" && (
                  <p className="text-[11px] text-indigo-500 mt-1.5">Master has full access to everything — no permissions needed.</p>
                )}
              </div>

              {/* Permissions — only for user role */}
              {form.role === "user" && (
                <PermissionGrid
                  permissions={form.permissions}
                  onChange={(p) => setForm((prev) => ({ ...prev, permissions: p }))}
                />
              )}
            </div>

            {formError && (
              <div className="mx-6 mb-3 flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {formError}
              </div>
            )}

            <div className="flex justify-end gap-3 p-6 border-t">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-60 transition-all">
                {saving ? "Saving..." : <><Check size={14} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
