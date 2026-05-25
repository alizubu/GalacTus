"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SaveButton from "@/components/admin/SaveButton";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-xl h-64 bg-gray-50 animate-pulse" />
  ),
});

// [N5] Stat fields saved to DB
const STAT_FIELDS = [
  { key: "about_stat_years",        label: "Years Experience",     placeholder: "5", suffix: "+" },
  { key: "about_stat_projects",     label: "Projects Delivered",   placeholder: "50", suffix: "+" },
  { key: "about_stat_satisfaction", label: "Client Satisfaction",  placeholder: "100", suffix: "%" },
  { key: "about_stat_industries",   label: "Industries Served",    placeholder: "3", suffix: "" },
];

export default function AboutAdminPage() {
  const [bio, setBio] = useState("");
  const [stats, setStats] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        setBio(data.about_bio ?? "");
        const s: Record<string, string> = {};
        STAT_FIELDS.forEach((f) => { s[f.key] = data[f.key] ?? ""; });
        setStats(s);
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); }); // [M3] .catch added
  }, []);

  const handleSave = async () => {
    const payload: Record<string, string> = { about_bio: bio };
    STAT_FIELDS.forEach((f) => { if (stats[f.key] !== undefined) payload[f.key] = stats[f.key]; });
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Save failed");
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">About / Bio</h1>
        <p className="text-gray-500 text-sm mt-1">
          Use the toolbar to format your bio — bold, headings, lists, links and more.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-1">
        <RichTextEditor
          content={bio}
          onChange={setBio}
          placeholder="Write your bio here..."
        />
      </div>

      {/* [N5] Editable stats */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-700">Stats Counter</h2>
        <p className="text-xs text-gray-400 -mt-2">Numbers shown under the bio section</p>
        <div className="grid grid-cols-2 gap-4">
          {STAT_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {f.label}{f.suffix ? ` (${f.suffix})` : ""}
              </label>
              <input
                type="number"
                min={0}
                value={stats[f.key] ?? ""}
                onChange={(e) => setStats((s) => ({ ...s, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          ))}
        </div>
      </div>

      <SaveButton onSave={handleSave} />
    </div>
  );
}
