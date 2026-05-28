"use client";

import { useState, useEffect } from "react";
import SaveButton from "@/components/admin/SaveButton";
import ImageUpload from "@/components/admin/ImageUpload";
import { Eye, EyeOff } from "lucide-react";

const FIELDS = [
  { key: "site_title",       label: "Site Title (Browser Tab)",  placeholder: "Shelvey Dias | Digital Marketing Strategist" },
  { key: "site_description", label: "Meta Description (SEO)",    placeholder: "Corporate Marketing Strategist...", multiline: true },
  { key: "site_url",         label: "Site URL",                  placeholder: "https://shelveyswork.com" },
  { key: "footer_text",      label: "Footer Text",               placeholder: "© 2026 Shelvey Dias" },
  { key: "og_image",         label: "OG Image URL (Social Share)", placeholder: "https://..." },
];

export default function SettingsAdminPage() {
  const [values, setValues]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(true);
  const [showPwForm, setShowPwForm] = useState(false);
  const [pw, setPw]             = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw]     = useState(false);
  const [pwMsg, setPwMsg]       = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d) => { setValues(d); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const handleSave = async () => {
    const payload: Record<string, string> = {};
    [...FIELDS.map((f) => f.key), "site_favicon"].forEach((key) => {
      if (values[key] !== undefined) payload[key] = values[key];
    });
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Save failed");
  };

  const handlePwChange = async () => {
    if (pw.next !== pw.confirm) { setPwMsg("Passwords don't match."); return; }
    if (pw.next.length < 8)    { setPwMsg("Password must be at least 8 characters."); return; }
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: pw.current, next: pw.next }),
    });
    if (res.ok) { setPwMsg("Password changed successfully."); setPw({ current: "", next: "", confirm: "" }); }
    else { const d = await res.json(); setPwMsg(d.error ?? "Failed."); }
  };

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Site metadata and admin preferences</p>
      </div>

      {/* ── Favicon ── */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-700">Favicon</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            The small icon shown in browser tabs. Use a square PNG or SVG (32×32 or 64×64 recommended).
          </p>
        </div>

        <div className="flex items-start gap-5">
          {/* Current favicon preview */}
          <div className="shrink-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Preview</p>
            <div className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
              {values.site_favicon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={values.site_favicon} alt="favicon" className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-[10px] text-gray-400">None</span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <ImageUpload
              label="Upload Favicon (PNG, SVG, ICO)"
              value={values.site_favicon ?? ""}
              onChange={(url) => setValues((v) => ({ ...v, site_favicon: url }))}
            />
          </div>
        </div>
      </div>

      {/* ── Site metadata ── */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-700">Site Metadata</h2>
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
            {f.multiline ? (
              <textarea rows={3} value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400 resize-none" />
            ) : (
              <input type="text" value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
            )}
          </div>
        ))}
      </div>

      <SaveButton onSave={handleSave} />

      {/* ── Change password ── */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <button onClick={() => setShowPwForm((v) => !v)}
          className="text-sm font-semibold text-gray-700 hover:text-gray-900">
          {showPwForm ? "▲" : "▼"} Change Admin Password
        </button>
        {showPwForm && (
          <div className="mt-4 space-y-3">
            {[
              { key: "current", label: "Current Password" },
              { key: "next",    label: "New Password" },
              { key: "confirm", label: "Confirm New Password" },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{f.label}</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={pw[f.key as keyof typeof pw]}
                    onChange={(e) => setPw((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 pr-10"
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
            {pwMsg && (
              <p className={`text-xs ${pwMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>{pwMsg}</p>
            )}
            <button onClick={handlePwChange}
              className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
