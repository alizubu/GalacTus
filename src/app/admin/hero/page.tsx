"use client";

import { useState, useEffect } from "react";
import SaveButton from "@/components/admin/SaveButton";

const FIELDS = [
  { key: "hero_name", label: "Full Name", placeholder: "Shelvey Dias" },
  { key: "hero_greeting", label: "Greeting", placeholder: "Hi, I'm" },
  { key: "hero_tagline", label: "Tagline / Role", placeholder: "Corporate Marketing Strategist" },
  { key: "hero_description", label: "Short Description", placeholder: "5+ years driving real results...", multiline: true },
  { key: "hero_avatar_url", label: "Avatar Image URL", placeholder: "/assets/images/shelvey.jpeg" },
];

export default function HeroAdminPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => { setValues(data); setLoading(false); })
      .catch((err) => { console.error(err); setFetchError("Failed to load data. Refresh the page."); setLoading(false); });
  }, []);

  const handleSave = async () => {
    const payload: Record<string, string> = {};
    FIELDS.forEach((f) => { if (values[f.key] !== undefined) payload[f.key] = values[f.key]; });
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? "Save failed"); }
  };

  if (loading) return <div className="text-gray-400 text-sm animate-pulse">Loading...</div>;
  if (fetchError) return <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-4">{fetchError}</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the top section of your portfolio</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
            {f.multiline ? (
              <textarea rows={3} value={values[f.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 resize-none" />
            ) : (
              <input type="text" value={values[f.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400" />
            )}
          </div>
        ))}
      </div>
      <SaveButton onSave={handleSave} />
    </div>
  );
}
