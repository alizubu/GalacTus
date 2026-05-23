"use client";

import { useState, useEffect } from "react";
import SaveButton from "@/components/admin/SaveButton";

export default function AboutAdminPage() {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => { setBio(data.about_bio ?? ""); setLoading(false); });
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ about_bio: bio }),
    });
    if (!res.ok) throw new Error("Save failed");
  };

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">About / Bio</h1>
        <p className="text-gray-500 text-sm mt-1">Edit your bio text (supports Markdown)</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Bio Content (Markdown supported)
        </label>
        <textarea
          rows={14}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write your bio here... Markdown is supported."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 resize-none font-mono"
        />
        <p className="text-xs text-gray-400 mt-2">
          Tip: Use **bold**, *italic*, [link](url), and line breaks for formatting.
        </p>
      </div>

      <SaveButton onSave={handleSave} />
    </div>
  );
}
