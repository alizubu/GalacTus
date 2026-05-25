"use client";

import { useState, useEffect } from "react";
import { Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

interface Profile {
  id: string; email: string; name: string; avatarUrl: string;
  role: string; permissions: string[];
}

const PERM_LABELS: Record<string, string> = {
  hero: "Hero Section", about: "About / Bio", experience: "Work Experience",
  education: "Education", skills: "Skills", projects: "Case Studies",
  gallery: "Gallery", navbar: "Navbar Editor", messages: "Messages",
  contact: "Contact Info", settings: "Settings",
};

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [name,      setName]      = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving,    setSaving]    = useState(false);

  // Password form state
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [pwSaving,   setPwSaving]   = useState(false);
  const [pwError,    setPwError]    = useState("");

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setName(data.name ?? "");
        setAvatarUrl(data.avatarUrl ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleProfileSave = async () => {
    if (!name.trim()) { toast.error("Name is required."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatarUrl }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Save failed."); return; }
      setProfile((p) => p ? { ...p, name: data.name, avatarUrl: data.avatarUrl } : p);
      toast.success("Profile updated.");
    } catch { toast.error("Network error."); }
    finally { setSaving(false); }
  };

  const handlePasswordSave = async () => {
    setPwError("");
    if (!currentPw || !newPw || !confirmPw) { setPwError("All password fields are required."); return; }
    if (newPw !== confirmPw) { setPwError("New passwords don't match."); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    setPwSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error ?? "Failed to change password."); return; }
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      toast.success("Password changed successfully.");
    } catch { setPwError("Network error."); }
    finally { setPwSaving(false); }
  };

  if (loading) {
    return (
      <div className="max-w-xl space-y-4">
        <div className="h-8 w-40 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-red-500 text-sm">Failed to load profile.</p>;
  }

  return (
    <div className="max-w-xl space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          {profile.role === "master"
            ? "Master account — full access"
            : `User account · ${profile.permissions.length} permission${profile.permissions.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Avatar + Name */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-700">Profile Info</h2>

        <ImageUpload
          label="Profile Photo"
          value={avatarUrl}
          onChange={setAvatarUrl}
        />

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full border border-gray-100 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-[11px] text-gray-400 mt-1">Email can only be changed by a master user.</p>
        </div>

        <button
          onClick={handleProfileSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-60 transition-all"
        >
          {saving ? "Saving..." : <><Check size={14} /> Save Profile</>}
        </button>
      </div>

      {/* My permissions (user only) */}
      {profile.role === "user" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-700">My Access Permissions</h2>
          <p className="text-xs text-gray-400">Permissions are set by the master user and cannot be changed here.</p>
          {profile.permissions.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No permissions assigned yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.permissions.map((p) => (
                <span key={p}
                  className="text-xs px-3 py-1.5 rounded-full font-medium border border-indigo-200 bg-indigo-50 text-indigo-700">
                  {PERM_LABELS[p] ?? p}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Change password */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-700">Change Password</h2>

        {[
          { label: "Current Password",  val: currentPw,  set: setCurrentPw },
          { label: "New Password",      val: newPw,      set: setNewPw },
          { label: "Confirm New Password", val: confirmPw, set: setConfirmPw },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        ))}

        {pwError && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            {pwError}
          </div>
        )}

        <button
          onClick={handlePasswordSave}
          disabled={pwSaving}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-60 transition-all"
        >
          {pwSaving ? "Updating..." : <><Check size={14} /> Update Password</>}
        </button>
      </div>
    </div>
  );
}
